"use client"
import React, {useCallback, useEffect, useState} from "react";
import {PScreen, PSEvent, UList} from "@/app/components/Containers";
import GCard from "@/app/components/GCard";
import GControl from "@/app/components/GControl";

const GContainer: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <div className="h-[100vh] w-[100vw] overflow-hidden">
                <div className="flex h-full w-full  flex-col gap-0">
                    {children}
                </div>
            </div>

        </>
    )
}

export default GContainer;

const ContainerContent: React.FC = ({}) => {

    const userDetails = [
            {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
                name: "John Doe",
                avatar: "/avatar.jpg",
                isSpeaking: true,
                micOn: false
            }, {
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


    const [isOpen, setIsOpen] = useState(false);
    const [isvisible, setIsvisible] = useState(isOpen);
    const [screenItems, setScreenItems] = useState(3);
    const [act, setAct] = useState(false);
    const open = () => {
        setIsvisible(true)
        setTimeout(() => setIsOpen(true),50);
        setScreenItems(2);
    }
    const close = () => {
        setIsOpen(prev => {
            if (!prev) return prev;
            setScreenItems(3);
            setIsOpen(false)
            setTimeout(() => setIsvisible(false), 300);
            return false;
        });
    }
    const event = useCallback((val: string) => {
        setTimeout(() => {
            val == "open" ? open() : close();
        },50)
    }, []);
    return (
        <>

            <div className={"vstack bg-gray-800 gap-1 "}>

                <div className={"p-1"}>
                    <div className="row !m-0 h-[90vh]">
                        <div
                            className={`!flex-none ${isOpen ? "col-9" : "!w-0"} ${!isvisible ? "hidden" : ""} h-full transform 
                            rounded-sm
                            !p-1 transition-width duration-300 ease-out`}>
                            <PScreen listener={(ev: PSEvent) => {
                                ev.on("action", event)
                            }}/>
                        </div>
                        <div className={"r-col !p-0"}>
                            <UList items={screenItems}>
                                {
                                    userDetails.map((user, index) => <GCard info={user} type={"user"}
                                                                            className={`${user.name} user-${index}`}
                                                                            key={index}
                                    />)
                                }
                                <GCard type="presentation" info={presentationDetails}/>
                            </UList>
                        </div>
                    </div>
                </div>
                <GControl/>
            </div>
        </>
    )
};
export {ContainerContent}

