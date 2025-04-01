"use client"
import React, {ReactNode, useCallback, useEffect, useRef} from "react";
import SignalBox from "@/app/manage/SignalBox";
import GIcon from "@/app/components/Icons";
import {sSm} from "@/app/manage/Screenshare";
import Alert from "@/app/components/ui/Alert";


interface VScreenProps {
    children?: ReactNode;
}
const UList: React.FC<VScreenProps> = React.memo(({
                                                      children
                                                  }: VScreenProps) => {
    return (
        <>
            <div className="grow w-full h-full">
                <div className={`w-full h-full`}>
                    {children}

                </div>
            </div>
        </>
    )
});

export interface PSEvent {
    on: (action: string, handler: Function) => void;
}

const PScreen: React.FC<{

    presenting?: boolean;
    listener: (event: PSEvent) => void

}> = React.memo(({presenting, listener}) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    let eventHandlers: Record<string, Function[]> = {};
    let ev = {
        on: (action: string, handler: Function) => {
            if (!eventHandlers[action]) {
                eventHandlers[action] = [];
            }
            eventHandlers[action].push(handler);
        },
        trigger(action: string, ...args: any[]): void {
            eventHandlers[action]?.forEach(handler => handler(...args));
        }
    }

    const handleScreenShare = (stream: MediaStream | null) => {
        ev.trigger("action", stream ? "open" : "close");

        if (videoRef.current) {
            if (stream && stream instanceof MediaStream) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().then(r => null);
            } else {
                videoRef.current.srcObject = null;
            }
        }
    };
    useEffect(() => {
        listener(ev);
        SignalBox.on("screenShare", handleScreenShare);
        return () => {
            SignalBox.off("screenShare", handleScreenShare);
        };
    }, []);


    return (
        <>
            <div className="w-full relative h-full pt-5 z-1 rounded-inherit flex justify-center items-center">
                <div className="absolute z-2 top-0 right-0 left-0">
                    <div className="rounded-sm w-full max-w-[80%] mx-auto px-3 py-1 bg-[rgb(60_64_67)]">
                        <div className="hstack gap-1">
                            <span className={"text-white font-bold"}>Abuti Martin</span>
                            <span className={"text-white font-bold"}> is presenting</span>

                            <div className="ms-auto hstack gap-2">
                                <div className={"text-green-500"}>
                                    <button className="hstack cursor-pointer hover:bg-gray-100 rounded-sm transitoion-all p-1 duration-150 gap-1">
                                        <GIcon name={"pause"} color={"text-green-500"} size={16}/>
                                    </button>
                                </div>
                                <div className={"text-red-400"}>
                                    <button
                                        onClick={ev => {
                                            Alert.confirm("Do you want to stop screen sharing?", handler => {
                                                handler.positiveFeedback("Yes", () => {
                                                    sSm.stop();
                                                });
                                            })
                                        }}
                                        className="hstack cursor-pointer py-2 gap-1">
                                        <GIcon name={"square"} color={"fill-red-400 text-white"} size={16}/>

                                        <span className={"whitespace-nowrap text-xs"}>Stop sharing</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <video ref={videoRef} autoPlay playsInline className="w-full rounded-inherit bg-dark h-full"></video>
            </div>
        </>
    )

});


const EndScreen: React.FC<{
    listener: (event: PSEvent) => void

}> = React.memo(({listener}) => {

    const videoRef = useRef<HTMLVideoElement>(null);
    let eventHandlers: Record<string, Function[]> = {};
    let ev = {
        on: (action: string, handler: Function) => {
            if (!eventHandlers[action]) {
                eventHandlers[action] = [];
            }
            eventHandlers[action].push(handler);
        },
        trigger(action: string, ...args: any[]): void {
            eventHandlers[action]?.forEach(handler => handler(...args));
        }
    }

    const handleScreenShare = (stream: MediaStream | null) => {
        ev.trigger("action", stream ? "open" : "close");

        if (videoRef.current) {
            if (stream && stream instanceof MediaStream) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().then(r => null);
            } else {
                videoRef.current.srcObject = null;
            }
        }
    };
    useEffect(() => {
        listener(ev);
        SignalBox.on("screenShare", handleScreenShare);
        return () => {
            SignalBox.off("screenShare", handleScreenShare);
        };
    }, []);


    return (
        <>
            <div className="w-full relative h-full pt-5 z-1 rounded-inherit flex justify-center items-center">
                <div className="absolute z-2 top-0 right-0 left-0">
                    <div className="rounded-sm w-full max-w-[80%] mx-auto px-3 py-1 bg-[rgb(60_64_67)]">
                        <div className="hstack gap-1">
                            <span className={"text-white font-bold"}>Abuti Martin</span>
                            <span className={"text-white font-bold"}> is presenting</span>

                            <div className="ms-auto hstack gap-2">
                                <div className={"text-green-500"}>
                                    <button className="hstack cursor-pointer btn gap-1">
                                        <GIcon name={"pause"} color={"text-green-500"} size={16}/>
                                    </button>
                                </div>
                                <div className={"text-red-400"}>
                                    <button
                                        onClick={ev => {
                                            Alert.confirm("Do you want to stop screen sharing?", handler => {
                                                handler.positiveFeedback("Yes", () => {
                                                    sSm.stop();
                                                });
                                            })
                                        }}
                                        className="hstack cursor-pointer btn gap-1">
                                        <GIcon name={"square"} color={"fill-red-400 text-white"} size={16}/>

                                        <span className={"whitespace-nowrap text-xs"}>Stop sharing</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <video ref={videoRef} autoPlay playsInline className="w-full rounded-inherit bg-dark h-full"></video>
            </div>
        </>
    )

});



export {UList, PScreen}