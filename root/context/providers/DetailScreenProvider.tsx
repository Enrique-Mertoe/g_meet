import React, {createContext, useContext} from "react";

type ChatContextType = {
    handler: { toggle: (tab: string, view: React.ReactNode) => void }
}

const DSProviderContext = createContext<ChatContextType>(
    {} as ChatContextType)

export const DetailScreenProvider = ({children}: {
    children: React.ReactNode
}) => {
    const e = []
    const toggle = (tab: string, view: React.ReactNode) => {
        // socket?.emit("new-chat", data)
        e.push([tab, view])
    }
    const handler = {
        toggle: (tab: string, view: React.ReactNode) => toggle(tab, view)
    }

    return <DSProviderContext.Provider
        value={
            {handler}
        }
    >
        {children}
    </DSProviderContext.Provider>
}

export const useDScreen = () => {
    const context = useContext(DSProviderContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context.handler
}