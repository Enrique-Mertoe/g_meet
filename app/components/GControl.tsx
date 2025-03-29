"use client";
import React, {useCallback} from "react";
import GIcon from "@/app/components/Icons";
import {useState} from "react";
import {lighten, darken} from "polished";

interface ControlParams {
    mute?: boolean
}

interface CEvent<T = any> {
    preventDefault: () => void,
    data: () => T,
    active: (state?: boolean) => void | boolean,
    icon: (name: string) => void

}

interface ControlItemProps<T = any> {
    icon: string;
    isActive?: boolean,
    activeColor?: string;
    inActiveColor?: string;
    extra?: React.ReactNode;
    onAction?: (event: CEvent<T>) => void;
    className?: string
}

const ControlItem: React.FC<ControlItemProps<boolean>> = ({
                                                              icon,
                                                              isActive = false,
                                                              extra,
                                                              onAction,
                                                              inActiveColor,
                                                              activeColor = inActiveColor,
                                                              className

                                                          }) => {

    const [inActiveState, setInActiveState] = useState(isActive);
    const [vIcon, setIcon] = useState(icon);
    let def = !0;

    const toggleState = function () {
        const newState = !inActiveState;
        setInActiveState(newState);
    }
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (onAction) {
            const event: CEvent<boolean> = {
                preventDefault: () => def = !1,
                data: () => inActiveState,
                active: (state) => typeof state == "undefined" ? inActiveState : setInActiveState(state),
                icon: name => {
                    setIcon(name)
                }
            };
            onAction(event);
        }

        if (def) {
            toggleState();
        }
    };

    const bgColor = (inActiveState ? activeColor : inActiveColor || "#333537") || "#333537";
    const lightBg = lighten(0.7, bgColor);
    const textColor = darken(0.4, bgColor);
    return (
        <>
            <div className={"bg-gray-200 bg-opacity-20 cursor-pointer flex p-[1px] rounded-full"}

            >
                {
                    extra ? (
                        <div className={`rounded-l-full p-2 bg-[${lightBg}] ` + className}
                             style={{backgroundColor: inActiveState ? lightBg : lightBg}}
                        >
                            <GIcon name={"chevron-up"} color={`text-${textColor}`} size={26}/>
                        </div>
                    ) : ''
                }
                <div className={`${extra ? "rounded-r-full" : "rounded-full"} p-2 ${className}`}
                     style={{backgroundColor: bgColor}}
                     onClick={handleClick}
                >
                    <GIcon name={vIcon} size={26}/>
                </div>
            </div>
        </>
    )
}

const GControl: React.FC<ControlParams> = ({mute}) => {


    const [isSharing, setIsSharing] = useState(false);
    let screenStream: MediaStream | null = null;

    const toggleScreenShare = useCallback(async (cb: (state: boolean) => void) => {
        try {
            if (!isSharing) {
                screenStream = await navigator.mediaDevices.getDisplayMedia({video: true});
                setIsSharing(true);
                cb(true);
                screenStream.getTracks()[0].onended = () => {
                    setIsSharing(false);
                    cb(false);
                };
            } else {
                screenStream?.getTracks().forEach((track) => track.stop());
                setIsSharing(false);
                cb(false);
            }
        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    }, [isSharing]);


    const MicExtra: React.FC = () => {
        return (
            <></>
        )
    }
    const VidExtra: React.FC = () => {
        return (
            <></>
        )
    }

    return (
        <>
            <div className="fixed right-0 left-0 bottom-0 pb-3">
                <div className="w-full flex justify-center items-center">
                    <div className="w-auto gap-4 rounded-full p-2 flex justify-center items-center"
                         style={{backgroundColor: "rgb(32, 33, 36)"}}
                    >
                        <ControlItem
                            extra={<MicExtra/>}
                            icon="mic-off"
                            activeColor={"#00a845"}
                            inActiveColor={"#410e0b"}
                            onAction={(ev) => {
                                ev.active() ?
                                    ev.icon("mic") : ev.icon("mic-off");
                            }}/>
                        <ControlItem
                            extra={<VidExtra/>}
                            inActiveColor={"#410e0b"}
                            activeColor={"#00a845"}
                            icon={"video-off"}/>
                        <ControlItem
                            onAction={e => {
                                e.preventDefault();
                                toggleScreenShare(state => e.active(state)).then(r => null)
                            }}
                            isActive={false}
                            activeColor={"#a8c7fa"}
                            inActiveColor={"gray"}
                            icon={"screen-share"}/>
                        <ControlItem
                            activeColor={"#a8c7fa"}
                            icon={"hand"}/>

                        <ControlItem
                            inActiveColor={"#333537"}
                            activeColor={"red"}
                            icon={"message-circle"}/>
                        <ControlItem
                            className={"px-1"}
                            inActiveColor={"#333537"}
                            icon={"more-vertical"}/>
                        <ControlItem
                            className={"px-5"}
                            inActiveColor={"red"}
                            icon={"phone"}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GControl;