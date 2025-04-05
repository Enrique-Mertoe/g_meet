"use client"
import React, {useEffect} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";


const Provider: React.FC = () => {
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return

    }, [socket]);
    // useEffect(() => {
    //     if (!socket) return;
    //
    //     socket.on('new-message', (data) => {
    //         console.log('Message:', data);
    //     });
    //
    //
    //     return () => {
    //         socket.off('new-message');
    //     };
    // }, [socket]);
    // useEffect(() => {
    //     if (!socket) return
    //     socket.on("message", () => {
    //         alert()
    //     });
    //     // ws.send({
    //     //     event: "milla",
    //     //     action: "null",
    //     //     identity: "me",
    //     //     data: {rt: ""}
    //     // })
    //     return () => {
    //         socket.off("message")
    //     };
    // }, [socket]);
    return (
        <>
        </>
    )
}
export default Provider