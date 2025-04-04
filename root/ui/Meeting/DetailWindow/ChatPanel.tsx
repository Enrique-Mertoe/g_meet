import React, {useEffect, useRef, useState} from "react";
import {Button} from "@/root/ui/components/material-design/button";
import GIcon from "@/root/ui/components/Icons";
import {DetailWindowHandler} from "@/root/ui/Meeting/DetailWindow/DetailWindowHandler";
import {TextInput} from "@/root/ui/components/material-design/Input";
import ToggleSwitch from "@/root/ui/components/material-design/ToggleSwitch";
import MessageItem from "@/root/ui/Meeting/Messaging/MessageItem";
import SignalBox from "@/root/manage/SignalBox";
import {acc} from "@/root/manage/useUserManager";
import {useWebSocket} from "@/root/context/WebSocketContext";
import Interceptors from "undici-types/interceptors";
import {Chat} from "@/root/manage/ChatManager";
import {generateMeetID} from "@/root/utility";

const ChatPanelView: React.FC = React.memo(() => {
    const [message, setInputValue] = useState("")
    let [messages, setMSG] = useState<MessageItemProps[]>([]);
    const [newMessage, setNewMessage] = useState(0);
    const formRef = useRef<HTMLFormElement | null>(null)
    const wsm = useWebSocket();
    const submit = () => {
        if (acc.user() && message) {
            wsm.send({
                event: "message",
                action: "new",
                identity: acc.user()?.uid ?? "",
                data: {message, id: generateMeetID()}
            })

            formRef.current?.reset()
            setInputValue("")
        }
    }
    const appendMessage = (newMessage: MessageItemProps) => {
        setMSG(prev => [...prev, newMessage])
        setNewMessage(prev => ++prev)
    };

    const handleMessageSignal = (data: WSResponse) => {
        let msg = data.data as MessageItemProps;
        const newMessage: MessageItemProps = {
            sender: data.identity === acc.user()?.uid ? "me" : "them",
            message: msg.message,
            id: msg.id
        };
        acc.user() &&
        appendMessage(newMessage)

    }
    useEffect(() => {
        acc.user() &&
        SignalBox.on("message", handleMessageSignal)
        return () => {

            SignalBox.off("message", handleMessageSignal);
        };
    }, []);

    let ids: string | string[] = []
    return (
        <div className={"vstack h-full"}>
            <div className="flex-1 overflow-y-auto sb-mini flex gap-2 flex-col-reverse p-2 ">
                <div className="vstack order-last">
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
                            <p>You can pin a message to make it visible for people who join later. When you leave
                                the call,
                                you won’t be able to access this chat.</p>
                        </div>
                    </div>
                </div>
                <div className="messages">
                    <div className="imessage">
                        {messages.map((msg, index) => {
                            if (ids.includes(msg.id)) return;
                            ids.push(msg.id)
                            return <MessageItem id={""} key={msg.id} sender={msg.sender} message={msg.message}/>
                        })}
                    </div>
                </div>

            </div>
            <form ref={formRef} method={"post"} onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}>
                <div className="rounded-full hstack gap-2 bg-[#f1f3f4] p-1">
                    <div className={"grow"}>
                        <TextInput
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={"Send message to everyone"}
                            className={"!border-0 !ring-0 placeholder:text-gray-700 !bg-transparent"}/>
                    </div>
                    <Button
                        icon={<GIcon color={"text-gray-800"} name={"paperclip"}/>}
                        className={"!rounded-full hover:bg-gray-100 border-0 !p-2"}

                    />
                    <Button
                        icon={<GIcon name={"send-horizontal"} color={"text-blue-500"}/>}
                        className={"spect-square border-0 !rounded-full !p-2"}
                        type={"submit"}
                    />
                </div>
                <div className="hstack px-3 py-1">

                </div>
            </form>
        </div>
    )
});

class Builder {
    private readonly view: React.FC
    private readonly title: string

    private static inst: Builder

    constructor() {
        this.title = "Messages"
        this.view = ChatPanelView
    }

    create(): DetailWindowHandler {
        return {
            view: this.view,
            title: this.title,
            key: "chat-panel"
        }
    }

    static instance() {
        if (!Builder.inst)
            Builder.inst = new Builder()
        return Builder.inst
    }
}


export default function () {
    return Builder.instance();
}