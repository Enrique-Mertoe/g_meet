import React, {useCallback, useEffect, useRef, useState} from "react";
import GIcon from "@/app/ui/components/Icons";
import Tooltip from "@/app/ui/components/material-design/Tooltip";
import {CEvent, ControlItemProps} from "@/app/ui/Meeting/Controls/Controls";


const ControlItem: React.FC<ControlItemProps<boolean> &
    React.HTMLAttributes<HTMLElement>> =
    React.memo(({
                    icon,
                    isActive = false,
                    extra,
                    onAction,
                    colors,
                    className,
                    onToggle,
                    design,
                    tooltip,
                    options,
                    ...rest
                }) => {
        const [inActiveState, setInActiveState] = useState(isActive);

        const [icon1, icon2] = icon.split("|");
        const [vIcon, setIcon] = useState(icon1);
        let def = true;

        const toggleState = useCallback(() => {
            setInActiveState(prevState => !prevState);
            icon2 &&
            setIcon(prev => prev == icon1 ? icon2 : icon1)
        }, []);
        const cEvent: CEvent<boolean> = {
            preventDefault: () => (def = false),
            data: () => inActiveState,
            active: (state) => typeof state === "undefined" ? inActiveState : setInActiveState(state),
            icon: (name) => setIcon(name),
        };

        const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();


            if (onAction) {
                onAction(cEvent);
            }

            if (def) {
                toggleState();
                if (onToggle) {
                    onToggle(cEvent);
                }
            }
        }, [onAction, onToggle, inActiveState, toggleState]);

        const [activeColor, inActiveColor] = (states => {
                let st = states.split("|", 2);
                return st.length > 1 ? st : [st[0], "bg-[#333537]"]
            }
        )(colors || "bg-transparent")
        const [bgColor, setBgColor] = useState<string>("");

        useEffect(() => {
            setBgColor(() => inActiveState ? activeColor : inActiveColor)
        }, [inActiveState]);

        const extractTextColor = (classStr: string) => {
            const match = classStr.match(/text-([a-zA-Z0-9]+)/);
            return match ? `text-${match[1]}` : "text-white"; // Returns "text-color" if found, otherwise empty
        };


        const textColor = extractTextColor(bgColor);
        let Cont = () => {

            const [ddVisible, setDdVisible] = useState(false)
            const [ddShown, setDdShown] = useState(false)
            const dShowRef = useRef<NodeJS.Timeout>(null)

            const handleDropdown = (open: boolean) => {
                if (open) {
                    setDdVisible(true)
                    dShowRef.current = setTimeout(() => setDdShown(true))
                } else {
                    setDdShown(false)
                    dShowRef.current = setTimeout(() => setDdVisible(false), 300)
                }
            }
            const ref = useRef<HTMLDivElement | null>(null);
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    handleDropdown(false)
                }
            };
            useEffect(() => {
                document.addEventListener("click", handleClickOutside);
                return () => {
                    document.removeEventListener("click", handleClickOutside);
                };
            }, []);

            return <>
                <div className="cursor-pointer flex p-0 rounded-full">
                    {extra && (
                        <div className={`rounded-l-full py-3 ps-2 bg-[#333537] ${className}`}>
                            <GIcon name="chevron-up" color={`text-white`} size={26}/>
                        </div>
                    )}
                    <div
                        ref={ref}
                        className={`${extra ? "rounded-r-full" : "rounded-full"} p-3 ${bgColor} ${className}  transition-all duration-150`}
                        onClick={() => {
                            if (!options) return handleClick
                            dShowRef.current && clearTimeout(dShowRef.current)
                            handleDropdown(!ddVisible)
                        }}
                        {...rest}
                    >
                        <GIcon name={vIcon} color={textColor} size={24}/>
                    </div>
                </div>
                {
                    options && <div
                        className={`absolute shadow-1 bg-dark -left-1/2 transform-x-1/2 bottom-full mb-2 transition-all duration-300 opacity-0
                         -translate-y-[10px] ${ddShown && "translate-y-0 opacity-100"} rounded ${!ddVisible && "hidden "}`}
                    >
                        <options.view
                            onClick={(ref) => {
                                options.handler(ref, cEvent)
                            }}
                        />
                    </div>
                }
            </>
        }
        return (
            tooltip ? (() => {
                    let [title, pos] = tooltip.split("|")
                    return <Tooltip text={title.trim()}
                                    position={(pos?.trim() ?? "top") as "top" | "bottom" | "left" | "right"}
                                    open={false}>
                        <Cont/>
                    </Tooltip>
                })() :
                <Cont/>

        );
    });

export default ControlItem