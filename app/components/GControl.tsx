"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import GIcon from "@/app/components/Icons";
import {lighten, darken} from "polished";
import SignalBox from "@/app/manage/SignalBox";
import {sSm} from "@/app/manage/Screenshare";
import Alert from "@/app/components/ui/Alert";

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
}

const ControlItem: React.FC<ControlItemProps<boolean>> = React.memo(({
                                                                         icon,
                                                                         isActive = false,
                                                                         extra,
                                                                         onAction,
                                                                         colors,
                                                                         className,
                                                                         onToggle
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
            let st = states.split("|");
            return st.length > 1 ? st : [st[0], "#333537"]
        }
    )(colors || "#333537")
    const bgColor = (inActiveState ? activeColor : inActiveColor);
    const lightBg = lighten(0.7, bgColor);
    const textColor = darken(0.4, bgColor);

    return (
        <div className="bg-gray-200 bg-opacity-20 cursor-pointer flex p-[1px] rounded-full">
            {extra && (
                <div className={`rounded-l-full p-2 bg-[${lightBg}] ${className}`} style={{backgroundColor: lightBg}}>
                    <GIcon name="chevron-up" color={`text-${textColor}`} size={26}/>
                </div>
            )}
            <div
                className={`${extra ? "rounded-r-full" : "rounded-full"} p-2 ${className}`}
                style={{backgroundColor: bgColor}}
                onClick={handleClick}
            >
                <GIcon name={vIcon} size={26}/>
            </div>
        </div>
    );
});

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
        <div className="fixed right-0 left-0 bottom-0 pb-3">
            <div className="w-full flex justify-center items-center">
                <div className="w-auto gap-4 bg-dark rounded-full p-2 flex justify-center items-center">
                    <ControlItem
                        extra={<></>}
                        icon="mic|mic-off"
                        isActive={true}
                        colors={"#00a845|#410e0b"}
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        extra={<></>}
                        colors={"#00a845|#410e0b"}
                        isActive={true}
                        icon="video|video-off"
                        onToggle={(ev) => {

                        }}
                    />
                    <ControlItem
                        onAction={(e) => {
                            e.preventDefault();
                            // sSm.ac = !sSm.ac;
                            // SignalBox.trigger("screenShare", sSm.ac);
                            // e.active(sSm.ac)
                            toggleScreenShare((state) => e.active(state)).then();
                        }}
                        isActive={false}
                        colors="#a8c7fa|gray"
                        icon="screen-share"
                    />
                    <ControlItem colors="#a8c7fa" icon="hand" onToggle={(e) => {
                        Alert.confirm("Quit", handler => {
                            handler.positiveFeedback("yes", () => {
                                alert("ok")
                            });
                            handler.negativeFeedback("No")
                        });
                        Alert.info("mica")
                    }}/>
                    <ControlItem colors="#333537" icon="message-circle"/>
                    <ControlItem className="px-1" colors="#333537" icon="more-vertical"/>
                    <ControlItem className="px-5" colors="red|red" icon="phone"/>
                </div>
            </div>
        </div>
    );
});

export default GControl;
