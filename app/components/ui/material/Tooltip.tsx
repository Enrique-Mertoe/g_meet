import {motion, AnimatePresence} from "framer-motion";
import React, {useEffect, useRef, useState} from "react";


const Tooltip: React.FC<{
    text: string;
    position: "top" | "bottom" | "left" | "right";
    open: boolean;
    children: React.ReactNode;
    design?: string;
}> = ({children, text, position = "top", open, design = ""}) => {
    const [hover, setHover] = useState(open);
    const [isVisible, setVisible] = useState(hover);
    const [isShown, setShown] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        adjust()
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [hover]);

    const adjust = () => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
        if (hover) {
            setVisible(true)
            timeoutRef.current = setTimeout(() => setShown(hover), 20)
        } else {
            setShown(false)
            timeoutRef.current = setTimeout(() => setVisible(false), 300)
        }
    }

    return (
        <>
            <div
                className="relative tooltip-wrapper"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {children}

                {isVisible && (
                    <div
                        ref={tooltipRef}
                        // initial={motionVariants[position]}
                        // animate="visible"
                        // exit={motionVariants[position]}
                        // transition={{ duration: 0.2 }}
                        className={`absolute ${isShown && "show opacity-100"} opacity-0 tooltip tooltip-top ${design}`}
                    >
                        <div className="tooltip-inner">
                            <p className={"text-center"}>
                                {text}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>

    );
};

export default Tooltip;
