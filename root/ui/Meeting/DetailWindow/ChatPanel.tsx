import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@/root/ui/components/material-design/button";
import GIcon from "@/root/ui/components/Icons";
import {DetailWindowHandler} from "@/root/ui/Meeting/DetailWindow/DetailWindowHandler";
import {TextInput} from "@/root/ui/components/material-design/Input";
import ToggleSwitch from "@/root/ui/components/material-design/ToggleSwitch";
import MessageItem from "@/root/ui/Meeting/Messaging/MessageItem";
import {acc} from "@/root/manage/useUserManager";
import {generateMeetID} from "@/root/utility";
import {useChat} from "@/root/context/providers/ChatProvider";
import {useFilePicker} from "@/root/hooks/useFilePicker";
import {ChatInfo, FileInfo} from "@/root/GTypes";

const ChatPanelView: React.FC = React.memo(function ChatPanelView() {
    const chat = useChat()

    const filePicker = useFilePicker()
    const [message, setInputValue] = useState("")
    const [messages, setMSG] = useState<ChatInfo[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [, setNewMessage] = useState(0);
    const formRef = useRef<HTMLFormElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const msgListener = useCallback((data: ChatInfo) => {
        data.sender = data.sender === acc.user()?.uid ? "me" : "them"
        // setMSG(prev => [...prev, data])
        setNewMessage(prevState => prevState + 1)
    }, [])
    useEffect(() => {
        if (!chat) return;
        chat.addListener(msgListener);
        setMSG(chat.currentChats())
        return () => {
            setMSG([])
            chat.removeListener(msgListener)
        };
    }, [chat, msgListener]);
    const submit = () => {
        if (message || file) {
            const msg = message;
            processFile(file, info => {
                chat?.send({
                        message: msg, id: generateMeetID(),
                        sender: acc.user()?.uid ?? "", file
                    }
                )
            });
            formRef.current?.reset()
            setInputValue("")
            setFile(null);
        }
    }

    const processFile = (file: File | null, cb: (fileInfo?: FileInfo) => void) => {
        if (!file) return cb()
        const reader = new FileReader();
        reader.onloadend = () => {
            const fileData = reader.result;

            if (fileData) {
                cb({
                    data: fileData,
                    name: file.name,
                    type: file.type,
                });
            }
        };

        reader.readAsArrayBuffer(file);
    }

    const handleFilePicker = () => {
        filePicker.pick(media => {

        })
        // setFiles(fileItems.map(fileItem => fileItem.file)); // Store the files selected in FilePond
    };

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
                            // if (ids.includes(msg.id)) return;
                            // ids.push(msg.id)
                            return <MessageItem id={""} key={msg.id} sender={msg.sender} message={msg.message}/>
                        })}
                    </div>
                </div>

            </div>
            <form ref={formRef} method={"post"} onSubmit={(e) => {
                e.preventDefault()
                submit()
            }}>
                <input
                    type="file"
                    ref={fileInputRef} // File input ref to trigger the click
                    accept=".doc,.pdf,.png,.jpg,.jpeg,.gif" // Acceptable file types
                    style={{display: "none"}} // Hidden input
                    onChange={(e) => {
                        if (e.target.files) {
                            setFile(e.target.files[0]); // Set selected file
                        }
                    }}
                />
                <div className="rounded-full hstack gap-2 bg-[#f1f3f4] p-1">
                    <div className={"grow"}>
                        <TextInput
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={"Send message to everyone"}
                            className={"!border-0 !ring-0 placeholder:text-gray-700 !bg-transparent"}/>
                    </div>
                    <Button
                        type={"button"}
                        icon={<GIcon color={"text-gray-800"} name={"paperclip"}/>}
                        className={"!rounded-full hover:bg-gray-100 border-0 !p-2"}
                        onClick={() => handleFilePicker()}

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

export {ChatPanelView}

export default function () {
    return Builder.instance();
}