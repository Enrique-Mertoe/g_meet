import {Button} from "@/root/ui/components/material-design/button";
import GIcon from "@/root/ui/components/Icons";
import React from "react";
import {ControlItemOptionsAction} from "@/root/ui/Meeting/Controls/Controls";



const ScreenShareOptions: React.FC<ControlItemOptionsAction> = ({onClick}) => {
    return (
        <>
            <div className="flex gap-2 p-2 flex-col">
                <Button
                    icon={
                        <GIcon name={"file-text"} color={"text-current"} size={16}/>
                    }
                    text={"Document"}
                    design={"primary-soft"}
                    className={"mb-1 !p-2 !px-4 text-sm bg-transparent text-white hover:!bg-[#333537]"}

                    onClick={() => onClick("document")}
                />
                <Button
                    icon={
                        <GIcon name={"monitor"} color={"text-current"} size={16}/>
                    }
                    onClick={() => onClick("screen")}
                    text={"Screen"}
                    design={"primary-soft"}
                    className={"mb-1 !p-2 !px-4 text-sm bg-transparent text-white hover:!bg-[#333537]"}
                />
            </div>
        </>
    )
}

export default function (options:ControlItemOptionsAction) {
    return <ScreenShareOptions {...options}/>
}