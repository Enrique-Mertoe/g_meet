import React from "react";
import {Button} from "@/app/components/ui/material/button";
import GIcon from "@/app/components/Icons";
import {DetailWindowHandler} from "@/app/components/Meeting/DetailWindow/DetailWindowHandler";
import Tooltip from "@/app/components/ui/material/Tooltip";

const InfoPanelView: React.FC = () => {

    return (
        <div className={"vstack p-2 rounded p-3"}>
            <h6 className={"font-bold mb-3 text-gray-900 text-sm"}>Joining Info</h6>
            <div className="vstack text-gray-700">
                <p>
                    https://meet.google.com/zox-txrm-xvd
                </p>
                <p>
                    <strong>Dial-in:</strong> (KE) +254 20 3893887
                </p>
                <p>
                    <strong>PIN:</strong> 872 927 077 4641#
                </p>
            </div>

            <div className="mt-4 gap-2">
                <Button
                    icon={
                        <GIcon name={"copy"} color={"text-current"} size={16}/>
                    }
                    text={"Copy joining info"}
                    design={"primary-soft"}
                    className={"!rounded-full mb-2 !p-2 !px-4 text-sm bg-transparent hover:!bg-blue-100 hover:!text-blue-500"}
                />
                <br/>

                <Button
                    icon={
                        <GIcon name={"forward"} color={"text-current"} size={16}/>
                    }
                    text={"Share info"}
                    design={"success-soft"}
                    className={"!rounded-full text-sm bg-transparent hover:!bg-green-100 hover:!text-green-500 !p-2 !px-4"}
                />
            </div>
        </div>
    )
}

class Builder {
    private readonly view: React.ReactNode
    private readonly title: string

    constructor() {
        this.title = "Meeting details"
        this.view = <InfoPanelView/>
    }

    create(): DetailWindowHandler {
        return {
            view: this.view,
            title: this.title,
            key: "info-panel"
        }
    }
}


export default function () {
    return new Builder();
}