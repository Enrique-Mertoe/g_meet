import React, {ReactNode, useEffect, useRef, useState} from "react";
import GIcon from "@/root/ui/components/Icons";
import {Button} from "@/root/ui/components/material-design/button";
import SignalBox from "@/root/manage/SignalBox";
import {DetailScreenHandler, DetailWindowHandler} from "@/root/ui/Meeting/DetailWindow/DetailWindowHandler";
import {Chat} from "@/root/manage/ChatManager";


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
            Chat.windowSignal = handler.mode
            if (handler.mode === "on") {
                setIsVisible(true);
                timeoutRef.current = setTimeout(() => setIsOpen(true), 10);
            } else {
                setIsOpen(false);
                timeoutRef.current = setTimeout(() => setIsVisible(false), 300);
            }
            handler.data && loadData(handler.data)

            setToggle(handler.mode == "on")
        };

        SignalBox.on("screen-details", handler);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
            SignalBox.off("screen-details", handler); // Remove event listener on unmount
        };
    }, []);


    const titleRef = useRef<HTMLElement>(null)
    const [Content,sContent] = useState<React.FC|null>(null)
    const loadData = (handler: DetailWindowHandler) => {
        if (titleRef.current) {
            titleRef.current.textContent = handler.title;
            sContent(handler.view)
        }
    }


    return (
        <>
            <div
                className={`relative flex-none pb-[5rem] py-[2px] transition-all duration-300 h-full p-0  ${isOpen ? "w-[350px]" : "w-0"} ${!visible && "hidden"}`}>
                <div className="rounded-md bg-white overflow-hidden w-[350px] h-full">
                    {
                        <div className={`size-full  flex flex-col ${!toggle && "hidden"}`}>
                            <div className="hstack border-b-1 p-3">
                                <span ref={titleRef} className={"font-bold text-gray-600"}>Activities</span>
                                <div className="ms-auto">
                                    <Button icon={<GIcon name={"arrow-right"} color={"text-gray-900"}/>}
                                            className={"aspect-square !rounded-full !p-2"}
                                            onClick={() => sdM.mode("off")}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 overflow-auto">

                                {Content && <Content/>}
                                {/*<ChatPanelView/>*/}
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