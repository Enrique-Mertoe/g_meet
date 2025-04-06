import React, {createContext, useContext, useEffect, useRef} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";

type PresentContextType = {
    handler: PresentationDelegate | null
}

const PresentProviderContext = createContext<PresentContextType>(
    {} as PresentContextType)

export const PresentProvider = ({children}: {
    children: React.ReactNode
}) => {
    const socket = useSocket()
    const handler = useRef<PresentationDelegate | null>(null)
    useEffect(() => {
        if (!socket) return
        handler.current = {
            onMouseMove: () => {
            }, sendMouseCoordinates: () => {
            }, onScrollChange: () => {
            },
            sendScrollCoordinates: () => {
            }
        }
    }, [socket]);

    return <PresentProviderContext.Provider
        value={
            {handler: handler.current}
        }
    >
        {children}
    </PresentProviderContext.Provider>
}

export const usePresentation = () => {
    const context = useContext(PresentProviderContext)
    if (!context) {
        throw new Error('usePresentation must be used within a PresentProviderContext');
    }
    return context.handler
}