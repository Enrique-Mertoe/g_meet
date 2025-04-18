import React from "react";
import {Button} from "@/root/ui/components/material-design/button";
import GIcon from "@/root/ui/components/Icons";
import {DetailWindowHandler} from "@/root/ui/Meeting/DetailWindow/DetailWindowHandler";
import Tooltip from "@/root/ui/components/material-design/Tooltip";
import {TextInput} from "@/root/ui/components/material-design/Input";

const ParticipantsView: React.FC = React.memo(() => {

    return (
        <div className={"vstack p-2 rounded p-3"}>
            <div>
                <Button
                    icon={
                        <GIcon name={"user-round-plus"} color={"text-current"} size={16}/>
                    }
                    text={"Add people"}
                    design={"primary-soft"}
                    className={"!rounded-full mb-2 !p-2 !px-4 text-sm"}
                />
            </div>

            <div
                className="rounded hstack mt-4 ring-1 ring-gray-300 hover:ring-blue-400 trnsition-all duration-200 focus-within:ring-blue-400 focus-within:ring-3">
                <div className="p-2">
                    <GIcon name={"search"} color={"text-current"} size={16}/>
                </div>
                <TextInput
                    placeholder={"Search people"}
                    className={"!border-0 !ring-0 "}
                />
            </div>

            <strong className="text-gray-600 my-4 mt-5 uppercase text-xs">in the meeting</strong>
            <div className="rounded-sm shadow-sm">
                <div className="p-3 rounded-t-sm hstack cursor-pointer borderb-1 bg-gray-100">
                    Contributors
                    <div className="ms-auto">
                        <GIcon name={"chevron-up"} color={"text-gray-500"}/>
                    </div>
                </div>

                <div className="py-5 vstack">
                    <div className="mx-auto">
                        <GIcon name={"g-loader"}/>
                    </div>
                </div>

            </div>
        </div>
    )
})

class Builder {
    private readonly view: React.FC
    private readonly title: string

    constructor() {
        this.title = "Participants"
        this.view = ParticipantsView
    }

    create(): DetailWindowHandler {
        return {
            view: this.view,
            title: this.title,
            key: "people-panel"
        }
    }
}


export default function () {
    return new Builder();
}