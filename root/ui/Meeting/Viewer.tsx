"use client";
import React, {useEffect, useRef} from "react";
import useWebSocket from "@/root/hooks/useWebSocket";

const Viewer: React.FC = () => {
    const {isConnected} = useWebSocket("ws://localhost:3500");
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3500");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.event === "scroll") {
                window.scrollTo({
                    top: (data.scroll_percent / 100) * (document.body.scrollHeight - window.innerHeight),
                    behavior: "smooth",
                });
            }

            if (data.event === "cursor_move" && cursorRef.current) {
                cursorRef.current.style.left = `${data.x_percent}%`;
                cursorRef.current.style.top = `${data.y_percent}%`;
            }
        };

        return () => ws.close();
    }, []);

    return (
        <div className="relative h-screen w-full overflow-auto bg-white">
            <div ref={cursorRef} className="absolute w-4 h-4 bg-red-500 rounded-full opacity-75"></div>
            Viewing...
        </div>
    );
};

export default Viewer;
