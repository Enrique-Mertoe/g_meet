import React, {useEffect} from "react";
import {sdM} from "@/root/ui/Meeting/DetailWindow/DetailScreen";
import InfoPanel from "@/root/ui/Meeting/DetailWindow/InfoPanel";
import ChatPanel from "@/root/ui/Meeting/DetailWindow/ChatPanel";
import ParticipantsPanel from "@/root/ui/Meeting/DetailWindow/ParticipantsPanel";
import ControlItem from "@/root/ui/Meeting/Controls/ControlItem";
import {useFilePicker} from "@/root/hooks/useFilePicker";
import {useDialog} from "@/root/ui/components/Dialogs/DialogProvider";

const DView = () => {
    const p = useFilePicker();
    const d = useDialog()
    return (
        <>
            <div className="w-auto gap-4 bg-dark pe-3 ms-auto rounded-full p-2 flex justify-center items-center">
                <ControlItem tooltip={"Meeting details"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="badge-info"
                             onClick={() => {
                                 sdM.toggleMode(InfoPanel().create())
                             }}
                />
                <ControlItem colors={"bg-transparent hover:bg-[#333537]"} tooltip={"Chat with everyone"} isActive={true}
                             icon="message-circle"
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
                             onClick={() => {
                                 // p.pick(e=>{})
                                 // p.pick(e=>{})
                                 // p.pick(e=>{})
                                 d.create({
                                     content: (() => {
                                         const Vi = React.memo(() => {
                                             useEffect(() => {
                                                 alert(3);
                                             }, []);
                                             return <>mss</>;
                                         });
                                         return <Vi/>
                                     })()
                                 })
                             }}
                             icon="layout-dashboard"/>
                <ControlItem tooltip={"Host controls"} colors={"bg-transparent hover:bg-[#333537]"} isActive={true}
                             icon="lock-person"/>
            </div>

        </>
    );
}
export default DView