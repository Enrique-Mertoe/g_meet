"use client"
import React, {createContext, useContext, useRef} from "react";
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
        // mediaPicker: () => MediaPicker
    }
    return (
        <AppProviderContext.Provider
            value={{handler: handler.current}}
        >
            {children}
        </AppProviderContext.Provider>)
}
export default AppInitProvider

export const useApp = () => {
    const context = useContext(AppProviderContext)
    if (!context) {
        throw new Error('useApp must be used within a AppProviderContext');
    }
    return context.handler
}