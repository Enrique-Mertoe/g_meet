import React, {useEffect, useRef, useState} from "react";
import GIcon from "@/app/components/Icons";
import {Button} from "@/app/components/ui/material/button";
import SignalBox from "@/app/manage/SignalBox";
import {sSm} from "@/app/manage/Screenshare";

export interface DetailScreenHandler {
    mode: "off" | "on"
}

const DetailScreen: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
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
        };

        SignalBox.on("screen-details", handler);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
            SignalBox.off("screen-details", handler); // Remove event listener on unmount
        };
    }, []);
    return (
        <>
            <div
                className={`relative flex-none transition-all duration-300 h-full py-2 pb-7  ${isOpen ? "w-96" : "w-0"} ${!visible && "hidden"}`}>
                <div className="rounded-sm bg-white w-full h-full">
                    <div className="hstack border-b-1 p-3">
                        <p className={"font-bold text-gray-600"}>Activities</p>
                        <div className="ms-auto">
                            <Button icon={<GIcon name={"x"} color={"text-gray-900"}/>}
                                    className={"aspect-square !rounded-full !p-2"}
                                    onClick={() => sdM.mode("off")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

class SDetailManager {
    private _mode: "on" | "off" = "off";

    mode(mode?: "on" | "off") {
        if (!mode)
            return this._mode;
        this._mode = mode
        SignalBox.trigger("screen-details", {
            mode: mode
        })
    }
}

export const sdM = new SDetailManager();

export default DetailScreen;