"use client"
import React, {ReactNode, useCallback, useEffect, useMemo, useRef} from "react";
import SignalBox from "@/root/manage/SignalBox";
import GIcon from "@/root/ui/components/Icons";
import {sSm} from "@/root/manage/ScreenShare/Screenshare";
import Alert from "@/root/ui/components/Dialogs/Alert";
import {PSEvent} from "@/root/ui/Meeting/PresentationDisplay";
import {Closure} from "@/root/GTypes";


interface VScreenProps {
    children?: ReactNode;
}

const UList: React.FC<VScreenProps> = React.memo(function UList({
                                                                    children
                                                                }: VScreenProps) {
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


const EndScreen: React.FC<{
    listener: (event: PSEvent) => void

}> = React.memo(function EndScreen({listener}) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const eventHandlers: Record<string, Closure[]> = useMemo(() => ({}), []);
    const ev = useMemo(() => {
        return {
            on: (action: string, handler: Closure) => {
                if (!eventHandlers[action]) {
                    eventHandlers[action] = [];
                }
                eventHandlers[action].push(handler);
            },
            trigger(action: string, ...args: unknown[]): void {
                eventHandlers[action]?.forEach(handler => handler(...args));
            }
        }
    }, [eventHandlers])

    const handleScreenShare = useCallback((stream: MediaStream | null) => {
        ev.trigger("action", stream ? "open" : "close");

        if (videoRef.current) {
            if (stream && stream instanceof MediaStream) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().then(r => null);
            } else {
                videoRef.current.srcObject = null;
            }
        }
    }, [ev]);
    useEffect(() => {
        listener(ev);
        SignalBox.on("screenShare", handleScreenShare);
        return () => {
            SignalBox.off("screenShare", handleScreenShare);
        };
    }, [ev, handleScreenShare, listener]);


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


export {UList}