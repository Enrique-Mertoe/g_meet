import React, {ReactNode, useEffect, useRef, useState} from "react";
import GIcon from "@/app/components/Icons";
import {Button} from "@/app/components/ui/material/button";
import SignalBox from "@/app/manage/SignalBox";
import {sSm} from "@/app/manage/Screenshare";
import {DetailScreenHandler, DetailWindowHandler} from "@/app/components/Meeting/DetailWindow/DetailWindowHandler";
import Alert from "@/app/components/ui/Alert";


const DetailScreen: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [visible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (handler: DetailScreenHandler) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current); // Cancel any ongoing timeout
            }

            if (handler.mode === "on") {
                setIsVisible(true);
                timeoutRef.current = setTimeout(() => setIsOpen(true), 10);
            } else {
                setIsOpen(false);
                timeoutRef.current = setTimeout(() => setIsVisible(false), 300);
            }
            setToggle(handler.mode == "on")

            handler.data && loadData(handler.data)
        };

        SignalBox.on("screen-details", handler);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
            SignalBox.off("screen-details", handler); // Remove event listener on unmount
        };
    }, []);


    const titleRef = useRef<HTMLElement>(null)
    const [content, setContent] = useState<ReactNode>(null)
    const loadData = (handler: DetailWindowHandler) => {
        if (titleRef.current) {
            titleRef.current.textContent = handler.title;
            setContent(handler.view)
        }
    }


    return (
        <>
            <div
                className={`relative flex-none pb-[5rem] transition-all duration-300 h-full p-2  ${isOpen ? "w-96" : "w-0 px-0"} ${!visible && "hidden"}`}>
                <div className="rounded-sm bg-white w-full h-full">
                    {
                        <div className={`h-full w-full flex flex-col ${!toggle && "hidden"}`}>
                            <div className="hstack border-b-1 p-3">
                                <span ref={titleRef} className={"font-bold text-gray-600"}>Activities</span>
                                <div className="ms-auto">
                                    <Button icon={<GIcon name={"arrow-right"} color={"text-gray-900"}/>}
                                            className={"aspect-square !rounded-full !p-2"}
                                            onClick={() => sdM.mode("off")}
                                    />
                                </div>
                            </div>
                            <div className="vstack grow ">
                                {content}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

interface SDetailProps {
    mode: DetailScreenHandler["mode"];
    handler: DetailWindowHandler;
}

class SDetailManager {
    private _mode: SDetailProps["mode"] = "off";
    private _handlers: Record<string, DetailWindowHandler> = {};
    private _activeHandler: string | null = null;

    mode(mode?: SDetailProps["mode"], handler?: DetailWindowHandler) {
        if (!mode) return this._mode;

        this._mode = mode;
        if (mode === "on") this._activeHandler = handler?.key ?? null;

        if (handler) this._handlers[handler.key] ||= handler;

        SignalBox.trigger("screen-details", {mode, data: handler});
    }

    toggleMode(handler?: DetailWindowHandler) {
        const isActive = this._mode === "on" && this._activeHandler === handler?.key;
        this.mode(isActive ? "off" : "on", handler);
    }

    activeHandler(handler?: DetailWindowHandler) {
        if (!handler) return this._activeHandler;
        this._activeHandler = handler.key;
    }
}

export const sdM = new SDetailManager();
export default DetailScreen;