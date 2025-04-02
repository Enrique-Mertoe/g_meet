import React from "react";
import {Button} from "@/app/components/ui/material/button";
import GIcon from "@/app/components/Icons";
import {DetailWindowHandler} from "@/app/components/Meeting/DetailWindow/DetailWindowHandler";
import Tooltip from "@/app/components/ui/material/Tooltip";
import {TextInput} from "@/app/components/ui/material/Input";
import ToggleSwitch from "@/app/components/ui/material/ToggleSwitch";

const ChatPanelView: React.FC = () => {

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

            </div>
            <div>
                <div className="rounded-full hstack gap-2 bg-[#f1f3f4] p-1">
                    <div className={"grow"}>
                        <TextInput
                            placeholder={"Send message to everyone"}
                            className={"!border-0 !ring-0 placeholder:text-gray-700 !bg-transparent"}/>
                    </div>
                    <Button
                        icon={<GIcon name={"send-horizontal"} color={"text-blue-500"}/>}
                        className={"spect-square !rounded-full !p-2"}
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