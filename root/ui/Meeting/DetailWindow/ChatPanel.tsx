import React, {useEffect, useState} from "react";
import {Button} from "@/root/ui/components/material-design/button";
import GIcon from "@/root/ui/components/Icons";
import {DetailWindowHandler} from "@/root/ui/Meeting/DetailWindow/DetailWindowHandler";
import {TextInput} from "@/root/ui/components/material-design/Input";
import ToggleSwitch from "@/root/ui/components/material-design/ToggleSwitch";
import useWSManager from "@/root/manage/WsManager";
import MessageItem from "@/root/ui/Meeting/Messaging/MessageItem";
import SignalBox from "@/root/manage/SignalBox";
import {acc, useUserManager} from "@/root/manage/useUserManager";

const ChatPanelView: React.FC = () => {
    const ws = useWSManager()
    const user = useUserManager()
    const [message, setInputValue] = useState("")
    const [messages, setMessages] = useState<MessageItemProps[]>([]);

    function submit() {
        if (acc.user())
            ws.send({
                event: "message",
                action: "new",
                identity: acc.user()?.uid ?? "",
                data: {message}
            })
    }

    const andleMSG = (data: WSResponse) => setMessages(prev => [...prev, {
        sender: data.identity === acc.user()?.uid ? "me" : "them",
        message: (data.data as MessageData)["message"]
    }]);
    useEffect(() => {
        SignalBox.on("message", (data:WSResponse)=>{
            console.log(user?.currentUser?.uid)
            acc.user() &&
            andleMSG(data)
        })
        return () => {
            SignalBox.off("message", andleMSG);
        };
    }, []);

    return (
        <div className={"vstack p-2 h-full p-3"}>
            <div className="grow">
                <div className={"rounded p-2 py-3 text-sm bg-[#f1f3f4] "}>
                    <div className="hstack">
                        <p>Let evey one send message</p>

                        <div className="ms-auto">
                            <ToggleSwitch/>
                        </div>
                    </div>
                </div>
                <div className={"rounded p-2 mt-4 text-center py-3 text-sm bg-[#f1f3f4] "}>
                    <div className="hstack">
                        <p>You can pin a message to make it visible for people who join later. When you leave the call,
                            you won’t be able to access this chat.</p>
                    </div>
                </div>
                <div className="messages">
                    <div className="imessage">
                        {messages.map((msg, index) => (
                            <MessageItem key={index} sender={msg.sender} message={msg.message}/>
                        ))}
                    </div>
                </div>

            </div>
            <div>
                <div className="rounded-full hstack gap-2 bg-[#f1f3f4] p-1">
                    <div className={"grow"}>
                        <TextInput
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={"Send message to everyone"}
                            className={"!border-0 !ring-0 placeholder:text-gray-700 !bg-transparent"}/>
                    </div>
                    <Button
                        icon={<GIcon name={"send-horizontal"} color={"text-blue-500"}/>}
                        className={"spect-square !rounded-full !p-2"}
                        onClick={() => submit()

                        }
                    />
                </div>
            </div>
        </div>
    )
}

class Builder {
    private readonly view: React.ReactNode
    private readonly title: string

    constructor() {
        this.title = "Messages"
        this.view = <ChatPanelView/>
    }

    create(): DetailWindowHandler {
        return {
            view: this.view,
            title: this.title,
            key: "chat-panel"
        }
    }
}


export default function () {
    return new Builder();
}