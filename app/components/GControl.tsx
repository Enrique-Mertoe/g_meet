"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import GIcon from "@/app/components/Icons";
import {lighten, darken} from "polished";
import SignalBox from "@/app/manage/SignalBox";
import {sSm} from "@/app/manage/Screenshare";
import Alert from "@/app/components/ui/Alert";
import {sdM} from "@/app/components/ui/elements/DetailScreen";
import InfoPanel from "@/app/components/Meeting/DetailWindow/InfoPanel";
import Tooltip from "@/app/components/ui/material/Tooltip";
import ChatPanel from "@/app/components/Meeting/DetailWindow/ChatPanel";
import ParticipantsPanel from "@/app/components/Meeting/DetailWindow/ParticipantsPanel";

interface ControlParams {
    mute?: boolean;
}

interface CEvent<T = any> {
    preventDefault: () => void;
    data: () => T;
    active: (state?: boolean) => void | boolean;
    icon: (name: string) => void;
}

interface ControlItemProps<T = any> {
    icon: string;
    isActive?: boolean;
    colors?: string;
    extra?: React.ReactNode;
    onAction?: (event: CEvent<T>) => void;
    className?: string;
    onToggle?: (event: CEvent<T>) => void;
    design?: string;
    tooltip?: string
}

const ControlItem: React.FC<ControlItemProps<boolean> & React.HTMLAttributes<HTMLElement>> = React.memo(({
                                                                                                             icon,
                                                                                                             isActive = false,
                                                                                                             extra,
                                                                                                             onAction,
                                                                                                             colors,
                                                                                                             className,
                                                                                                             onToggle,
                                                                                                             design,
                                                                                                             tooltip,
                                                                                                             ...rest
                                                                                                         }) => {
    const [inActiveState, setInActiveState] = useState(isActive);

    const [icon1, icon2] = icon.split("|");
    const [vIcon, setIcon] = useState(icon1);
    let def = true;

    const toggleState = useCallback(() => {
        setInActiveState(prevState => !prevState);
        icon2 &&
        setIcon(prev => prev == icon1 ? icon2 : icon1)
    }, []);


    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const event: CEvent<boolean> = {
            preventDefault: () => (def = false),
            data: () => inActiveState,
            active: (state) => typeof state === "undefined" ? inActiveState : setInActiveState(state),
            icon: (name) => setIcon(name),
        };

        if (onAction) {
            onAction(event);
        }

        if (def) {
            toggleState();
            if (onToggle) {
                onToggle(event);
            }
        }
    }, [onAction, onToggle, inActiveState, toggleState]);

    const [activeColor, inActiveColor] = (states => {
            let st = states.split("|", 2);
            return st.length > 1 ? st : [st[0], "bg-[#333537]"]
        }
    )(colors || "bg-transparent")
    const [bgColor, setBgColor] = useState<string>("");

    useEffect(() => {
        setBgColor(() => inActiveState ? activeColor : inActiveColor)
    }, [inActiveState]);

    const extractTextColor = (classStr: string) => {
        const match = classStr.match(/text-([a-zA-Z0-9]+)/);
        return match ? `text-${match[1]}` : "text-white"; // Returns "text-color" if found, otherwise empty
    };

// Example usage:
    const textColor = extractTextColor(bgColor);
    let Cont = <div className="cursor-pointer flex p-0 rounded-full">
        {extra && (
            <div className={`rounded-l-full py-3 ps-2 bg-[#333537] ${className}`}>
                <GIcon name="chevron-up" color={`text-white`} size={26}/>
            </div>
        )}
        <div
            className={`${extra ? "rounded-r-full" : "rounded-full"} p-3 ${bgColor} ${className} transition-all duration-150`}
            onClick={handleClick}
            {...rest}
        >
            <GIcon name={vIcon} color={textColor} size={24}/>
        </div>
    </div>
    return (
        tooltip ? (() => {
                let [title, pos] = tooltip.split("|")
                return <Tooltip text={title.trim()} position={(pos?.trim() ?? "top") as "top" | "bottom" | "left" | "right"}
                                open={false}>
                    {Cont}
                </Tooltip>
            })() :
            Cont

    );
});

const TimeDisplay = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            setTime(`${hours}:${minutes.toString().padStart(2, "0")} ${seconds.toString().padStart(2, "0")} ${ampm}`);
        };

        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="hstack transition-all duration-300 gap-3">
            <span>{time}</span>
            <span>|</span>
            <span>Meeting ID</span>
        </div>
    );
};

const GControl: React.FC<ControlParams> = React.memo(({mute}) => {
    const [isSharing, setIsSharing] = useState(false);
    const callback = useRef<(state: boolean) => void>(null);

    const listener = useCallback((active: boolean) => {
        if (!active) {
            callback.current?.(false);
            SignalBox.trigger("screenShare", null);
        }
    }, []);

    useEffect(() => {
        sSm.addListener(listener);
        return () => {
            sSm.removeListener(listener);
        };
    }, [listener]);


    const toggleScreenShare = useCallback(async (cb: (state: boolean) => void) => {
        callback.current = cb;
        if (!sSm.isSharing()) {
            sSm.start((stream) => {
                SignalBox.trigger("screenShare", stream);
                callback.current?.(true);
            });
        } else {
            sSm.stop();
        }

    }, []);

    return (
        <div className="fixed z-5 right-0 left-0 bottom-0 pb-1">
            <div className="w-full flex justify-center items-center">
                <div
                    className="w-auto me-auto ms-6 gap-4 text-white font-bold bg-dark rounded-full p-2 flex justify-center items-center">
                    <TimeDisplay/>
                </div>
                <div className="mx-auto gap-4 bg-dark me-auto rounded-full p-2 flex justify-center items-center">
                    <ControlItem
                        tooltip={"Microphone"}
                        extra={<></>}
                        icon="mic|mic-off"
                        isActive={true}
                        colors={"bg-[#333537] text[#601410] | bg-[#f9dedcaa] text-[#601410]"}
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        tooltip={"Camera"}
                        extra={<></>}
                        colors={"bg-[#333537] text[#601410] | bg-[#f9dedcaa] text-[#601410]"}
                        isActive={true}
                        icon="video|video-off"
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        tooltip={"Present now"}
                        onAction={(e) => {
                            e.preventDefault();
                            // sSm.ac = !sSm.ac;
                            // SignalBox.trigger("screenShare", sSm.ac);
                            // e.active(sSm.ac)
                            toggleScreenShare((state) => e.active(state)).then();
                        }}
                        isActive={false}
                        colors="bg-[#a8c7fa]"
                        icon="screen-share"
                    />
                    <ControlItem tooltip={"Raise hand"} colors="bg-[#a8c7fa]" icon="hand" onToggle={(e) => {
                        Alert.confirm("Quit", handler => {
                            handler.positiveFeedback("yes", () => {
                            });
                            handler.negativeFeedback("No")
                        });
                    }}/>
                    <ControlItem tooltip={"More options"} className="px-1" colors="#333537" icon="more-vertical"/>
                    <ControlItem tooltip={"Leave"} className="px-6" isActive={true}
                                 colors="bg-[#dc362e] hover:bg-[#df463e]|bg-[#dc362e] hover:bg-[#df463e]" icon="phone"/>
                </div>
                <div className="ms-auto">
                    <DetailView/>
                </div>
            </div>
        </div>
    );
});


const DetailView = () => {

    const handleClick = useCallback(() => {
        sdM.mode(sdM.mode() == "off" ? "on" : "off");

    }, [])

    return (
        <>
            <div className="w-auto gap-4 bg-dark pe-3 ms-auto rounded-full p-2 flex justify-center items-center">
                <ControlItem tooltip={"Meeting details"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="info"
                             onClick={() => {
                                 sdM.toggleMode(InfoPanel().create())
                             }}
                />
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"Chat with everyone"} isActive={true}
                             icon="message-square-text"
                             onClick={() => {
                                 sdM.toggleMode(ChatPanel().create())
                             }}
                />
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"People"} isActive={true}
                              onClick={() => {
                                 sdM.toggleMode(ParticipantsPanel().create())
                             }}
                             icon="users"/>
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"Activities"} isActive={true}
                             icon="shapes"/>
                <ControlItem tooltip={"Host controls"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="lock-person"/>
            </div>

        </>
    );
}

export default GControl;
