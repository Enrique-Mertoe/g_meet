import React, {useEffect, useRef} from "react";
import SignalBox from "@/root/manage/SignalBox";
import GIcon from "@/root/ui/components/Icons";
import Alert from "@/root/ui/components/Dialogs/Alert";
import {sSm} from "@/root/manage/ScreenShare/Screenshare";
import Presenter from "@/root/ui/Meeting/Presenter";
import {useAccount, useUserManager} from "@/root/manage/useUserManager";
import Viewer from "@/root/ui/Meeting/Viewer";
import {Closure} from "@/root/GTypes";
import {ScreenProvider} from "@/root/context/providers/ScreenProvider";

export interface PSEvent {
    on: (action: string, handler: Closure) => void;
}

const PScreen: React.FC<{

    presenting?: boolean;
    listener: (event: PSEvent) => void

}> = React.memo(function PScreen({presenting, listener}) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const account = useAccount();
    const eventHandlers: Record<string, Closure[]> = {};
    const ev = {
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

    const handleDocShare = (stream: boolean) => {
        ev.trigger("action", stream ? "open" : "close");


    };
    useEffect(() => {
        listener(ev);
        SignalBox.on("screenShare", handleScreenShare);
        SignalBox.on("docShare", handleDocShare);
        return () => {
            SignalBox.off("screenShare", handleScreenShare);
            SignalBox.off("docShare", handleDocShare);
        };
    }, []);


    return (
        <>
            <div className="size-full relative  pt-5 z-1 rounded-inherit flex justify-center items-center">
                <div className="absolute z-2 top-0 right-0 left-0">
                    <div className="rounded-sm w-full max-w-[80%] mx-auto px-3 py-1 bg-[rgb(60_64_67)]">
                        <div className="hstack gap-1">
                            <span className={"text-white font-bold"}>Abuti Martin</span>
                            <span className={"text-white font-bold"}> is presenting</span>

                            <div className="ms-auto hstack gap-2">
                                <div className={"text-green-500"}>
                                    <button
                                        className="hstack cursor-pointer hover:bg-gray-100 rounded-sm transitoion-all p-1 duration-150 gap-1">
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

                {/*<video ref={videoRef} autoPlay playsInline className="w-full rounded-inherit bg-dark h-full"></video>*/}
                <ScreenProvider>
                    {
                        account.account() == "host" ?
                            <Presenter/>
                            :
                            <Viewer/>
                    }
                </ScreenProvider>
            </div>
        </>
    )

});

export default PScreen;