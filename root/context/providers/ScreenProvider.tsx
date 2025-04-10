import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";
import {
    ChatContextProvider,
    ChatInfo,
    Closure,
    Dict,
    ScreenContextProvider,
    ScreenRequest,
    TypingInfo
} from "@/root/GTypes";


type ScreenContextType = {
    handler: ScreenContextProvider | null
}
const ScreenContext = createContext<ScreenContextType>({handler: null})

export const ScreenProvider = ({children}: {
    children: React.ReactNode
}) => {
    const socket = useSocket()
    const chats = useRef<ChatInfo[]>([])
    const receiveHandlers = useRef<Dict<(chat: ScreenRequest) => void>>({})
    const typeHandlers = useRef<((info: TypingInfo) => void)[]>([])

    // Typing effect
    const [isTyping, setIsTyping] = useState(false);
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Notify the server you started typing
        if (!isTyping) {
            setIsTyping(true);
            // socket?.emit('typing', {chatId, userId});
        }

        // Reset timer to detect when user stops
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            setIsTyping(false);
            // socket.emit('stopTyping', {chatId, userId});
        }, 3000); // if user stops typing for 3s
    };

    const send = useCallback((data: ScreenRequest) => {
        socket?.emit("screen-event", data)
    }, [socket])

    const addListener = (l: string, handler: (res: ScreenRequest) => void) => {
        receiveHandlers.current[l] = handler
    }
    const onType = (handler: (info: TypingInfo) => void) => {
        if (typeHandlers.current.includes(handler)) return;
        typeHandlers.current.push(handler)
    }
    const removeListener = (handler: string) => {
        delete receiveHandlers.current[handler]
    }
    const handler = useRef<ScreenContextProvider | null>(null)
    useEffect(() => {
        if (!socket) return
        socket.on("screen-event", (data: { from: unknown, data: ScreenRequest }) => {
            const d = data.data;
            receiveHandlers.current[d.event]?.(d)
            // chats.current.push(data.data)
        });
        handler.current = {
            sendInfo: (e: ScreenRequest) => send(e),
            addListener: (l, e: (chat: ScreenRequest) => void) => addListener(l, e),
            onType: (e: (chat: TypingInfo) => void) => onType(e),
            removeListener: (l: string) => removeListener(l),
            currentChats: () => chats.current
        }
    }, [send, socket]);

    return <ScreenContext.Provider
        value={{handler: handler.current}}
    >
        {children}
    </ScreenContext.Provider>
}

export const useScreen = () => {
    const context = useContext(ScreenContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context.handler
}