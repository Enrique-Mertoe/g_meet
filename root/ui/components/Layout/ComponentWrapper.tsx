"use client"
import React, {RefObject, useCallback, useEffect, useRef, useState} from "react";
import UserGrid from "@/root/ui/Meeting/UserGrid";
import DetailScreen from "@/root/ui/Meeting/DetailWindow/DetailScreen";
import GControl from "@/root/ui/Meeting/Controls/GControl";
import PresentationDisplay, {PSEvent} from "@/root/ui/Meeting/PresentationDisplay";
import {acc, useUserManager} from "@/root/manage/useUserManager";
import {useWebSocket, WebSocketProvider} from "@/root/context/WebSocketContext";

const ComponentWrapper: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <div className="h-full w-full overflow-hidden">
                <div className="flex h-full w-full  flex-col gap-0">
                    {children}
                </div>
            </div>

        </>
    )
}

export default ComponentWrapper;

const MainContent: React.FC = ({}) => {
    const wsm = useWebSocket();
    const userDetails = [
            {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            },
            {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            },
            {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                uid: "c",
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }
        ],
        presentationDetails = {
            title: "Live Presentation",
            content: (<iframe src="https://example.com/presentation" className="w-full h-full"/>)
        };

    useUserManager()
    const [isOpen, setIsOpen] = useState(true);
    const [isvisible, setIsvisible] = useState(isOpen);
    const [screenItems, setScreenItems] = useState(userDetails);
    const [act, setAct] = useState(false);
    const [itemsPerRow, setItemsPerRow] = useState(3);
    const [rows, setRows] = useState(3);
    const [showMore, setShowMore] = useState(false);
    const [ready, setReady] = useState(false),
        [iHeight, setIHeight] = useState(0.0);
    const [itemSize, setItemSize] = useState({width: 200, height: 150});

    const containerRef = useRef<HTMLDivElement | null>(null);


    const open = () => {
        setIsvisible(true)
        setTimeout(() => setIsOpen(true), 50);
        // setScreenItems(2);
    }
    const close = () => {
        setIsOpen(prev => {
            if (!prev) return prev;
            // setScreenItems(3);
            setIsOpen(false)
            setTimeout(() => setIsvisible(false), 300);
            return false;
        });
    }
    const event = useCallback((val: string) => {
        setTimeout(() => {
            val == "open" ? open() : close();
        }, 50)
    }, []);

    const adjust = (items: number) => {
        setItemsPerRow(() => {


            return items;
        });
    }
    const gap = 5; // Gap between items
    const padding = 10;

    const handleResize = () => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;

            // Available space after considering padding
            const availableWidth = width - 2 * padding;
            const availableHeight = height - 2 * padding;

            // Determine items per row based on available width
            let newItemsPerRow;
            if (availableWidth < 320) {
                newItemsPerRow = 2;
            } else if (availableWidth < 768) {
                newItemsPerRow = 2;
            } else {
                newItemsPerRow = 3;
            }

            // Calculate item width considering gaps
            const totalGapWidth = (newItemsPerRow - 1) * gap;
            const itemWidth = (availableWidth - totalGapWidth) / newItemsPerRow;

            // Calculate item height dynamically
            let itemHeight = itemWidth * 0.75;

            // Calculate number of rows that can fit
            const maxRows = Math.floor(availableHeight / (itemHeight + gap));
            const totalGapHeight = (maxRows - 1) * gap;
            let calculatedRows = Math.floor((availableHeight - totalGapHeight) / itemHeight);

            // Adjust item height if needed
            let threshold = (calculatedRows * (itemHeight + gap)) / availableHeight
            if (threshold > .5) {
                calculatedRows += 1
            }
            if ((calculatedRows * (itemHeight + gap)) > availableHeight) {
                itemHeight = availableHeight / calculatedRows - (calculatedRows * (gap / 2))
            }

            // Update states
            setItemsPerRow(newItemsPerRow);
            setItemSize({width: itemWidth, height: itemHeight});
            setRows(calculatedRows);

            // Determine the number of items to display
            const itemsToShow = screenItems.slice(0, newItemsPerRow * calculatedRows);
            setShowMore(screenItems.length > itemsToShow.length);
        }
    };

    useEffect(() => {
        handleResize()
        const observer = new ResizeObserver(() => {
            handleResize();
        });
        containerRef.current &&
        observer.observe(containerRef.current);
        setTimeout(() => setReady(true));

        return () => {
            containerRef.current &&
            observer.unobserve(containerRef.current);

        };
    }, [screenItems, itemsPerRow, rows]);


    const screenRef = useRef<HTMLDivElement | null>(null);
    const parentRef = useRef<HTMLDivElement | null>(null);

    let timeout: string | number | NodeJS.Timeout | undefined;
    const doResize = (parent: HTMLElement, containerRef: HTMLElement, screenRef: HTMLElement) => {
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        if (parentWidth >= 768) {
            if (timeout)
                clearTimeout(timeout)
            // **MD and larger: Horizontal layout**
            const screenWidth = isOpen ? parentWidth * 0.75 : 0;
            const sidebarWidth = isOpen ? parentWidth * 0.25 : parentWidth;

            screenRef.style.width = `${screenWidth - 10}px`;
            screenRef.style.height = `calc(${parentHeight}px - 1rem)`;
            screenRef.style.left = ".5rem";
            screenRef.style.top = "1rem";

            containerRef.style.width = `${sidebarWidth - 10}px`;
            containerRef.style.height = `calc(${parentHeight}px - 1rem)`;
            containerRef.style.right = ".5rem";
            containerRef.style.top = "1rem";
        } else {

            screenRef.style.height = `auto`;
            screenRef.style.left = "0";
            screenRef.style.width = "100%";
            screenRef.style.top = "1rem";

            screenRef.offsetHeight;
            const sidebarHeight = isOpen ? parentHeight - screenRef.clientHeight : parentHeight;

            containerRef.style.height = `calc(${sidebarHeight}px - 1rem)`;
            containerRef.style.minWidth = `calc(${sidebarHeight}px - 1rem)`;
            timeout = setTimeout(() => {
                containerRef.style.width = "100%";
                const sidebarHeight = isOpen ? parentHeight - screenRef.clientHeight : parentHeight;
                containerRef.style.height = `calc(${sidebarHeight}px - 1rem)`;
                containerRef.style.top = `calc(${screenRef.clientHeight}px + 1rem)`;
                // }
            }, 350);

        }
    }
    const attempt = () => {
        if (!containerRef.current || !screenRef.current) return;
        const parent = parentRef.current;

        if (!parent) return;
        doResize(parent, containerRef.current, screenRef.current)
        return true
    }
    useEffect(() => {
        // const handleResize = () => attempt();
        // window.addEventListener("resize", handleResize);
        // handleResize();
        // const observer = new ResizeObserver(() => {
        //     handleResize();
        // });
        // parentRef.current &&
        // observer.observe(parentRef.current);
        //
        //
        // return () => {
        //     parentRef.current &&
        //     observer.unobserve(parentRef.current);
        //     window.removeEventListener("resize", handleResize);
        // };
    }, [isOpen]);

    useEffect(() => {
        if (acc.account() && wsm.ready) {
            wsm.send({
                event: "connection",
                data: {},
                identity: "hvjv",
                action: "check"
            })
        }
    }, []);

    const itemsToShow = screenItems.slice(0, itemsPerRow * rows);

    // @ts-ignore
    // @ts-ignore
    return (
        <>

            <div className={"vstack h-full bg-[#131314] w-full gap-1 "}>

                <div className={"flex h-full"}>
                    <div
                        ref={parentRef}
                        className="relative grow flex pb-[5rem] h-full">

                        <div
                            ref={screenRef}
                            className={`transition-all w-[60%]  h-full  duration-300 ease-out
                ${isOpen ? "opacity-100" : "opacity-0 hidden"} rounded-sm !p-1`}
                        >
                            <PresentationDisplay listener={(ev: PSEvent) => ev.on("action", event)}/>
                        </div>

                        <div className={"h-full grow bg-gray-400"}>
                            <UserGrid items={userDetails} presentationDetails={presentationDetails}/>
                        </div>

                        {/* Sidebar */}
                        {/*<div*/}
                        {/*    ref={containerRef}*/}
                        {/*    className={`z-2 duration-200 top-0 w-full transition-all absolute ease-out`}*/}
                        {/*>*/}
                        {/*    <div className="relative w-full h-full">*/}
                        {/*        {ready && <UList>*/}
                        {/*            {itemsToShow.map((user, index) => {*/}
                        {/*                user = {...user, name: `${user.name}-${index}`};*/}
                        {/*                return (*/}
                        {/*                    <GCard*/}
                        {/*                        info={user}*/}
                        {/*                        type={"user"}*/}
                        {/*                        className={`${user.name} user-${index}`}*/}
                        {/*                        key={index}*/}
                        {/*                        style={{*/}
                        {/*                            position: 'absolute',*/}
                        {/*                            top: `${padding + Math.floor(index / itemsPerRow) * (itemSize.height + gap)}px`,*/}
                        {/*                            left: `${padding + (index % itemsPerRow) * (itemSize.width + gap)}px`,*/}
                        {/*                            width: `${itemSize.width}px`,*/}
                        {/*                            height: `${itemSize.height}px`,*/}
                        {/*                        }}*/}
                        {/*                    />*/}
                        {/*                );*/}
                        {/*            })}*/}
                        {/*            {showMore && (*/}
                        {/*                <div className="more-items-card hidden">*/}
                        {/*                    <GCard type="presentation" info={presentationDetails}/>*/}
                        {/*                </div>*/}
                        {/*            )}*/}
                        {/*        </UList>}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>


                    <DetailScreen/>
                </div>
                <GControl/>
            </div>
        </>
    )
};
export {MainContent}

