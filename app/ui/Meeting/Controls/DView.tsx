import React, {useCallback} from "react";
import {sdM} from "@/app/ui/Meeting/DetailWindow/DetailScreen";
import InfoPanel from "@/app/ui/Meeting/DetailWindow/InfoPanel";
import ChatPanel from "@/app/ui/Meeting/DetailWindow/ChatPanel";
import ParticipantsPanel from "@/app/ui/Meeting/DetailWindow/ParticipantsPanel";
import ControlItem from "@/app/ui/Meeting/Controls/ControlItem";

const DView = () => {

    const handleClick = useCallback(() => {
        sdM.mode(sdM.mode() == "off" ? "on" : "off");

    }, [])

    return (
        <>
            <div className="w-auto gap-4 bg-dark pe-3 ms-auto rounded-full p-2 flex justify-center items-center">
                <ControlItem tooltip={"Meeting details"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="info"
                             onClick={() => {
                                 sdM.toggleMode(InfoPanel().create())
                             }}
                />
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"Chat with everyone"} isActive={true}
                             icon="message-square-text"
                             onClick={() => {
                                 sdM.toggleMode(ChatPanel().create())
                             }}
                />
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"People"} isActive={true}
                             onClick={() => {
                                 sdM.toggleMode(ParticipantsPanel().create())
                             }}
                             icon="users"/>
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"Activities"} isActive={true}
                             icon="layout-dashboard"/>
                <ControlItem tooltip={"Host controls"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="lock-person"/>
            </div>

        </>
    );
}
export default DView