import {motion, AnimatePresence} from "framer-motion";
import React, {useEffect, useRef, useState} from "react";
import {$} from "@/app/components/ui/Query";

const positions = {
    top: "top-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-transparent",
};

const motionVariants = {
    top: {y: -10, opacity: 1},
    bottom: {y: 10, opacity: 0},
    left: {x: -10, opacity: 0},
    right: {x: 10, opacity: 0},
    visible: {x: 0, y: 0, opacity: 1},
};

const Tooltip: React.FC<{
    text: string;
    position: "top" | "bottom" | "left" | "right";
    open: boolean;
    children: React.ReactNode;
    design?: string;
}> = ({children, text, position = "top", open, design = ""}) => {
    const [hover, setHover] = useState(open);
    const [isVisible, setVisible] = useState(hover);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        adjust()
    }, [hover]);

    const adjust = () => {
        if (!containerRef.current || !tooltipRef.current) return
        let cont = containerRef.current
        let ttp = tooltipRef.current

        $(tooltipRef.current).css({
            top: `${cont.offsetTop - ttp.offsetHeight}px`
        })
    }

    return (
        <>
            <div
                ref={containerRef}
                className="relative inline-block"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {children}
            </div>
            {hover && (
                <div
                    ref={tooltipRef}
                    // initial={motionVariants[position]}
                    // animate="visible"
                    // exit={motionVariants[position]}
                    // transition={{ duration: 0.2 }}
                    className={`fixed z-3 px-2 py-[1px] show tooltip top text-white bg-gray-900 rounded  ${design}`}
                >
                    <div className="tooltip-inner">
                        {text}
                    </div>
                </div>
            )}
        </>

    );
};

export default Tooltip;
