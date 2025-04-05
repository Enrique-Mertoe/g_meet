"use client";
import React, {useEffect, useRef} from "react";
import {acc} from "@/root/manage/useUserManager";

const Presenter: React.FC = () => {
    // const ws = useWebSocket();
    const containerRef = useRef<HTMLDivElement>(null);
    const handleScroll = () => {
        const scrollPercent =
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        // ws.send({
        //     event: "scroll",
        //     action: "new",
        //     identity: acc.user()?.uid ?? "",
        //     data: {
        //         scroll_percent: scrollPercent
        //     }
        // })
        // ws.send({ event: "scroll",  });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x-4 <= rect.width && y >= 0 && y+4 <= rect.height) {
            const aspectRatio = rect.width / rect.height;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            // Send the data only when the cursor is inside the container
            // ws.send({
            //     event: "cursor_move",
            //     action: "new",
            //     identity: acc.user()?.uid ?? "",
            //     data: {
            //         x_percent: xPercent,
            //         y_percent: yPercent,
            //         aspect_ratio: aspectRatio,
            //     },
            // });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return <div ref={containerRef} className="size-full rounded overflow-auto bg-gray-100">Presenting...</div>;
};

export default Presenter;
