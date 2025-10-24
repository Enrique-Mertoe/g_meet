import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import SignalBox from "@/root/manage/SignalBox";
import GIcon from "@/root/ui/components/Icons";
import Alert from "@/root/ui/components/Dialogs/Alert";
import {sSm} from "@/root/manage/ScreenShare/Screenshare";
import Presenter from "@/root/ui/Meeting/Presenter";
import {useAccount, useUserManager} from "@/root/manage/useUserManager";
import Viewer from "@/root/ui/Meeting/Viewer";
import {Closure, FileInfo} from "@/root/GTypes";
import {ScreenProvider} from "@/root/context/providers/ScreenProvider";
import {useDialog} from "@/root/ui/components/Dialogs/DialogProvider";
import {useFilePicker} from "@/root/hooks/useFilePicker";
import AlbumThumb from "@/root/ui/Meeting/Sharing/tools";
import {toBlob} from "@/root/utility";

export interface PSEvent {
    on: (action: string, handler: Closure) => void;
}

const PScreen: React.FC<{
    participants?: any[];
    currentUserId?: string;
    listener: (event: PSEvent) => void
}> = React.memo(function PScreen({participants = [], currentUserId, listener}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const account = useAccount();
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

    const HSShare = useCallback((stream: MediaStream | null) => {
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
    const [extras, setExtra] = useState<FileInfo[]>([])
    const handleDocShare = useCallback((files: FileInfo[]) => {
        if (!files.length)
            return
        ev.trigger("action", "open");
        SignalBox.trigger("is-presenting", true)
        if (files.length > 0) {
            SignalBox.trigger("present-file", files[0])
            setExtra(files.slice(1))
        }

    }, [ev]);
    useEffect(() => {
        listener(ev);
        SignalBox.on("screenShare", HSShare);
        SignalBox.on("docShare", handleDocShare);
        return () => {
            SignalBox.off("screenShare", HSShare);
            SignalBox.off("docShare", handleDocShare);
        };
    }, [ev, handleDocShare, HSShare, listener]);


    return (
        <>
            <div className="size-full relative  pt-1 z-1 rounded-inherit flex justify-center items-center">
                <div className="vstack gap-1 size-full">
                    <div className="absolutde z-2 top-0 right-0 left-0">
                        <div className="hstack">
                            <div className="rounded-sm w-full max-w-[80%] mx-auto px-3 py-1 bg-[rgb(60_64_67)]">
                                <div className="hstack gap-1">
                                    <span className={"text-white font-bold"}>
                                        {participants.find(p => p.isPresenting)?.name || 'Someone'}
                                    </span>
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

                            <div className="album-image-container">
                                <AlbumThumb files={extras}/>
                            </div>
                        </div>
                    </div>

                    {/*<video ref={videoRef} autoPlay playsInline className="w-full rounded-inherit bg-dark h-full"></video>*/}
                    <div className="flex-1">
                        <ScreenProvider>
                            {
                                participants.find(p => p.uid === currentUserId)?.isPresenting ?
                                    <Presenter/>
                                    :
                                    <Viewer/>
                            }
                        </ScreenProvider>
                    </div>
                </div>
            </div>
        </>
    )

});

export default PScreen;
