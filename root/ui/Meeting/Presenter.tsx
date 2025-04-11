"use client";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {acc} from "@/root/manage/useUserManager";
import {useScreen} from "@/root/context/providers/ScreenProvider";
import GIcon from "@/root/ui/components/Icons";
import SignalBox from "@/root/manage/SignalBox";
import {toBlob} from "@/root/utility";
import {Dict} from "@/root/GTypes";

export type PresentFileSrc = {
    type: "img" | "vid" | "doc";
    info: string | unknown;
    loaded: boolean
}
const Presenter: React.FC = () => {
    const screen = useScreen();
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true)
    const [fileSrc, setFileSrc] = useState<PresentFileSrc | null>(null)

    const handleScroll = useCallback(() => {
        const scrollPercent =
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        screen?.sendInfo({
            event: "scroll",
            action: "new",
            identity: acc.user()?.uid ?? "",
            data: {
                scroll_percent: scrollPercent
            }
        })
        // ws.send({ event: "scroll",  });
    }, [screen]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x - 4 <= rect.width && y >= 0 && y + 4 <= rect.height) {
            const aspectRatio = rect.width / rect.height;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            screen?.sendInfo({
                event: "cursor",
                action: "new",
                identity: acc.user()?.uid ?? "",
                data: {
                    x_percent: xPercent,
                    y_percent: yPercent,
                    aspect_ratio: aspectRatio,
                },
            });
        }
    }, [screen]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove, handleScroll]);
    const types: Dict<PresentFileSrc["type"]> = useMemo(() => ({
        "image/png": "img"
    }), [])

    useEffect(() => {
        SignalBox.on("present-file", file => {
            setFileSrc(() => {
                const f: PresentFileSrc = {
                    type: types[file.type as string],
                    info: file.data, loaded: false
                }
                return f
            })
        });
        return () => {
            SignalBox.off("present-file");
        }
    }, [types]);

    function hLoad() {
        setLoading(false)
    }

    return (
        <>
            <div ref={containerRef} className="size-full bg-[rgb(60_64_67)] p-[1px] rounded relative">
                <div className="flex size-full justify-center items-center">
                    {
                        fileSrc?.type == "img" &&
                        <img
                            className={"max-w-full"}
                            src={toBlob(fileSrc.info as ArrayBuffer)}
                            onLoad={() => hLoad()}
                        />}
                </div>

                {
                    loading &&
                    <div className="absolute inset-0">
                        <div className="flex size-full justify-center items-center"
                             style={{background: "rgba(255,255,255,.3)"}}
                        >
                            <GIcon name={"g-loader"} color={"fill-blue-400"} size={104}/>
                        </div>

                    </div>

                }
            </div>
        </>
    );
};

export default Presenter;
