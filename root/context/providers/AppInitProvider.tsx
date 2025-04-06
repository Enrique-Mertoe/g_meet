"use client"
import React, {createContext, useContext, useEffect, useRef} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";
import MediaPicker from "@/root/lib/MediaPicker";
import {ApplicationProp} from "@/root/GTypes";


type AppInitType = {
    handler: ApplicationProp | null
}

export const AppProviderContext = createContext<AppInitType>(
    {} as AppInitType
)

const AppInitProvider = ({children}: { children: React.ReactNode }) => {
    const handler = useRef<ApplicationProp | null>(null)

    handler.current = {
        mediaPicker: () => MediaPicker
    }
    return (
        <AppProviderContext.Provider
            value={{handler: handler.current}}
        >
            {children}
        </AppProviderContext.Provider>)
}
const Provider: React.FC = () => {
    const socket = useSocket();
    useEffect(() => {
        if (!socket) return

    }, [socket]);

    return (
        <>
        </>
    )
}
export default AppInitProvider

export const useApp = () => {
    const context = useContext(AppProviderContext)
    if (!context) {
        throw new Error('useApp must be used within a AppProviderContext');
    }
    return context.handler
}