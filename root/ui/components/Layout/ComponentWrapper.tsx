"use client"
import React, {useCallback, useEffect, useRef, useState} from "react";
import UserGrid from "@/root/ui/Meeting/UserGrid";
import DetailScreen from "@/root/ui/Meeting/DetailWindow/DetailScreen";
import GControl from "@/root/ui/Meeting/Controls/GControl";
import PresentationDisplay, {PSEvent} from "@/root/ui/Meeting/PresentationDisplay";
import {useUserManager} from "@/root/manage/useUserManager";
import DScreenContext from "@/root/context/DScreenContext";
import {useFilePicker} from "@/root/hooks/useFilePicker";
import {useMeetingSocket} from "@/root/hooks/useMeetingSocket";
// import {useWebSocket, WebSocketProvider} from "@/root/context/WebSocketContext";

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

interface MainContentProps {
    meetingId?: string;
    userId?: string;
    userName?: string;
}

const MainContent: React.FC<MainContentProps> = ({ meetingId, userId, userName }) => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [meeting, setMeeting] = useState<any>(null);

    // Fetch meeting data and participants
    const fetchMeetingData = useCallback(async () => {
        if (!meetingId) return;

        try {
            const response = await fetch(`/api/meeting?type=get&meetingId=${meetingId}`);
            const data = await response.json();

            if (data.ok && data.data) {
                setMeeting(data.data);
                console.log('Meeting data received:', data.data);
                console.log('Raw participants:', data.data.participants);

                // Convert participants to UserInfo format
                // Filter out participants who have left (leftAt is set)
                const activeParticipants = data.data.participants?.filter((p: any) => !p.leftAt) || [];

                const participantsList = activeParticipants.map((p: any, index: number) => {
                    // p.userId is the populated user object from backend
                    const user = p.userId;
                    const userName = user?.firstName
                        ? `${user.firstName} ${user.lastName || ''}`.trim()
                        : user?.fullName || `User ${index + 1}`;

                    return {
                        uid: user?._id || user?.id || `user-${index}`,
                        name: userName,
                        avatar: user?.profileUrl || "/avatar.jpg",
                        isSpeaking: false,
                        micOn: !p.isMuted,
                        videoOn: !p.isVideoOff,
                        role: p.role || 'participant'
                    };
                });

                console.log('Processed participants:', participantsList);
                setParticipants(participantsList);
            }
        } catch (error) {
            console.error('Error fetching meeting data:', error);
        }
    }, [meetingId]);

    // WebSocket meeting integration
    const { joinMeeting, leaveMeeting } = useMeetingSocket({
        meetingId,
        userId,
        userName,
        onUserJoined: (data) => {
            console.log('User joined:', data);
            // Add new participant to the list
            setParticipants(prev => {
                // Check if user already exists
                const exists = prev.find(p => p.uid === data.userId);
                if (exists) return prev;

                return [...prev, {
                    uid: data.userId,
                    name: data.userName || 'New User',
                    avatar: "/avatar.jpg",
                    isSpeaking: false,
                    micOn: true,
                    videoOn: true,
                    role: 'participant'
                }];
            });
        },
        onUserLeft: (data) => {
            console.log('User left:', data);
            // Remove participant from the list
            setParticipants(prev => prev.filter(p => p.uid !== data.userId));
        },
        onParticipantStatusChanged: (data) => {
            console.log('Participant status changed:', data);
            // Update participant status
            setParticipants(prev => prev.map(p =>
                p.uid === data.userId
                    ? { ...p, ...data.status }
                    : p
            ));
        },
    });

    // Fetch meeting data on mount
    useEffect(() => {
        fetchMeetingData();
    }, [fetchMeetingData]);

    // Join meeting via API and WebSocket when component mounts
    useEffect(() => {
        if (meetingId && userId && userName) {
            // Join meeting via API
            const joinMeetingAPI = async () => {
                try {
                    const response = await fetch('/api/meeting', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'join',
                            meetingId,
                        })
                    });

                    const data = await response.json();
                    if (data.ok) {
                        console.log('Successfully joined meeting via API:', meetingId);
                        // Fetch updated meeting data with new participant
                        await fetchMeetingData();
                        // Join WebSocket room
                        joinMeeting();
                    } else if (data.error === 'You are already in this meeting') {
                        // User is already in the meeting (page refresh case)
                        // Just fetch the current data and join WebSocket
                        console.log('Already in meeting, rejoining WebSocket:', meetingId);
                        await fetchMeetingData();
                        joinMeeting();
                    } else {
                        console.error('Failed to join meeting:', data.error);
                    }
                } catch (error) {
                    console.error('Error joining meeting:', error);
                }
            };

            void joinMeetingAPI();

            // Cleanup: Leave meeting when component unmounts
            return () => {
                leaveMeeting();
            };
        }
    }, [meetingId, userId, userName, joinMeeting, leaveMeeting, fetchMeetingData]);

    // const p = useFilePicker()
    // useEffect(() => {
    //     p.pick(file => {})
    // }, []);

    const presentationDetails = {
        title: "Live Presentation",
        content: (<iframe src="https://example.com/presentation" className="w-full h-full"/>)
    };

    useUserManager()
    const [isOpen,] = useState(false);
    // const [, setIsvisible] = useState(isOpen);
    // const [act, setAct] = useState(false);
    const [itemsPerRow, setItemsPerRow] = useState(3);
    const [rows, setRows] = useState(3);
    const [, setShowMore] = useState(false);
    const [, setReady] = useState(false);
    // [iHeight, setIHeight] = useState(0.0);
    const [, setItemSize] = useState({width: 200, height: 150});

    const containerRef = useRef<HTMLDivElement | null>(null);


    // const open = () => {
    //     setIsvisible(true)
    //     setTimeout(() => setIsOpen(true), 50);
    //     // setScreenItems(2);
    // }
    // const close = () => {
    //     setIsOpen(prev => {
    //         if (!prev) return prev;
    //         // setScreenItems(3);
    //         setIsOpen(false)
    //         setTimeout(() => setIsvisible(false), 300);
    //         return false;
    //     });
    // }
    const event = useCallback((val: string) => {
        console.log(val)
        setTimeout(() => {
            // val == "open" ? open() : close();
        }, 50)
    }, []);

    // const adjust = (items: number) => {
    //     setItemsPerRow(() => {
    //
    //
    //         return items;
    //     });
    // }
    const gap = 5; // Gap between items
    const padding = 10;

    const handleResize = useCallback(() => {
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
            const threshold = (calculatedRows * (itemHeight + gap)) / availableHeight
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
            const itemsToShow = participants.slice(0, newItemsPerRow * calculatedRows);
            setShowMore(participants.length > itemsToShow.length);
        }
    }, [participants]);

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
            observer.unobserve(containerRef.current);

        };
    }, [participants, itemsPerRow, rows, handleResize]);


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

            // screenRef.offsetHeight;
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
    console.log(doResize)
    // const attempt = () => {
    //     if (!containerRef.current || !screenRef.current) return;
    //     const parent = parentRef.current;
    //
    //     if (!parent) return;
    //     doResize(parent, containerRef.current, screenRef.current)
    //     return true
    // }
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
        // if (acc.account() && wsm.ready) {
        //     wsm.send({
        //         event: "connection",
        //         data: {},
        //         identity: "hvjv",
        //         action: "check"
        //     })
        // }
    }, []);

    // const itemsToShow = screenItems.slice(0, itemsPerRow * rows);

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
                            <UserGrid items={participants} presentationDetails={presentationDetails}/>
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


                    <DScreenContext>
                        <DetailScreen/>
                    </DScreenContext>
                </div>
                <GControl/>
            </div>
        </>
    )
};
export {MainContent}

