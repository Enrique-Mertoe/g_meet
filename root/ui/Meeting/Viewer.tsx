"use client";
import React, {useEffect, useRef} from "react";
// import {useWebSocket} from "@/root/context/WebSocketContext";
import {useUserManager} from "@/root/manage/useUserManager";
import SignalBox from "@/root/manage/SignalBox";
import {PresenterMouse, PresenterScroll, WSResponse} from "@/root/GTypes";

const Viewer: React.FC = () => {
    // const ws = useWebSocket();
    const user = useUserManager()
    const cursorRef = useRef<HTMLDivElement>(null);
     const containerRef = useRef<HTMLDivElement>(null);
    const hScroll = (info: WSResponse) => {
        const data = info.data as PresenterScroll
        window.scrollTo({
            top: (data.scroll_percent / 100) * (document.body.scrollHeight - window.innerHeight),
            behavior: "smooth",
        });
    }
    const hCMove = (info: WSResponse) => {

        const data = info.data as PresenterMouse
        if (!cursorRef.current || !containerRef.current) return;
        cursorRef.current.style.left = `${data.x_percent}%`;
        cursorRef.current.style.top = `${data.y_percent}%`;
        containerRef.current.style.aspectRatio = String(data.aspect_ratio)
        console.log(data)
    }
    useEffect(() => {
        SignalBox.on("scroll", hScroll)
        SignalBox.on("cursor_move", hCMove)
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
            SignalBox.off("scroll", hScroll)
            SignalBox.off("cursor_move", hCMove)
        }
    }, []);

    return (
        <div ref={containerRef} className="relative w-full overflow-auto bg-white">
            <div ref={cursorRef} className="absolute w-4 h-4 bg-red-500 rounded-full opacity-75"></div>
            Viewing... as {user.accountType}
        </div>
    );
};

export default Viewer;
