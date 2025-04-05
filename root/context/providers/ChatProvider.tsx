import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";


type ChatContextType = {
    handler: ChatContextProvider | null
}
const ChatContex = createContext<ChatContextType>({handler: null})

export const ChatProvider = ({children}: {
    children: React.ReactNode
}) => {
    const socket = useSocket()
    const chats = useRef<ChatInfo[]>([])
    const receiveHandlers = useRef<((chat: ChatInfo) => void)[]>([])
    const send = (data: ChatInfo) => {
        socket?.emit("new-message", data)
    }
    const onReceive = (handler: (chat: ChatInfo) => void) => {
        receiveHandlers.current.push(handler)
    }
    const handler = useRef<ChatContextProvider | null>(null)
    useEffect(() => {
        if (!socket) return
        socket.on("new-message", (data) => {
            receiveHandlers.current.forEach(h => {
                h?.(data.data)
            })
            chats.current.push(data)

        });
        handler.current = {
            send: (e: ChatInfo) => send(e),
            onReceive: (e: (chat: ChatInfo) => void) => onReceive(e),
            currentChats: () => chats.current
        }
    }, [socket]);

    return <ChatContex.Provider
        value={{handler: handler.current}}
    >
        {children}
    </ChatContex.Provider>
}

export const useChat = () => {
    const context = useContext(ChatContex)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context.handler
}