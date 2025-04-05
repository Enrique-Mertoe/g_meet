"use client"
import React, {useEffect} from "react";
import AppInitProvider from "@/root/context/providers/AppInitProvider";
import {SocketProvider, useSocket} from "@/root/context/providers/SocketProvider";
import {DetailScreenProvider} from "@/root/context/providers/DetailScreenProvider";

const AppContext: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    return (
        <>
            <SocketProvider>
                <AppInitProvider/>
                <DetailScreenProvider>
                    {children}
                </DetailScreenProvider>
            </SocketProvider>
        </>
    )
}
export default AppContext;