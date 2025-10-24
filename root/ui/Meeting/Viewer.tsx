"use client";
import React, {useEffect, useRef} from "react";
// import {useWebSocket} from "@/root/context/WebSocketContext";
import {useUserManager} from "@/root/manage/useUserManager";
import SignalBox from "@/root/manage/SignalBox";
import {PresenterMouse, PresenterScroll, ScreenResponse, WSResponse} from "@/root/GTypes";
import {useScreen} from "@/root/context/providers/ScreenProvider";

const Viewer: React.FC = () => {
    const screen = useScreen()
    const user = useUserManager()
    const cursorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hScroll = (info: ScreenResponse) => {
        const data = info.data as PresenterScroll
        window.scrollTo({
            top: (data.scroll_percent / 100) * (document.body.scrollHeight - window.innerHeight),
            behavior: "smooth",
        });
    }
    const hCMove = (info: ScreenResponse) => {

        const data = info.data as PresenterMouse
        if (!cursorRef.current || !containerRef.current) return;
        cursorRef.current.style.left = `${data.x_percent}%`;
        cursorRef.current.style.top = `${data.y_percent}%`;
        containerRef.current.style.aspectRatio = String(data.aspect_ratio)
        console.log(data)
    }
    useEffect(() => {
        // SignalBox.on("scroll", hScroll)
        // SignalBox.on("cursor_move", hCMove)
        screen?.addListener("cursor", hCMove)
        screen?.addListener("scroll", hScroll)
        // SignalBox.on(event) => {
        //     const data = JSON.parse(event.data);
        //
        //     if (data.event === "scroll") {
        //
        //     }
        //
        //     if (data.event === "cursor_move" && cursorRef.current) {
        //
        //     }
        // };
        return () => {
            screen?.removeListener("scroll")
            screen?.removeListener("cursor")
            // SignalBox.off("scroll", hScroll)
            // SignalBox.off("cursor_move", hCMove)
        }
    }, [screen]);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-auto bg-gray-100">
            <div ref={cursorRef} className="absolute h-2 w-2 bg-red-500 rounded-full opacity-75 pointer-events-none z-10"></div>
            <div className="flex items-center justify-center h-full text-gray-600">
                Waiting for presentation...
            </div>
        </div>
    );
};

export default Viewer;
