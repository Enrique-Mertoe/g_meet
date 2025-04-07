import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useSocket} from "@/root/context/providers/SocketProvider";
import {ChatContextProvider, ChatInfo, Closure, TypingInfo} from "@/root/GTypes";


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

    const send = useCallback((data: ChatInfo) => {
        socket?.emit("new-message", data)
    }, [socket])

    const onReceive = (handler: (chat: ChatInfo) => void) => {
        receiveHandlers.current.push(handler)
    }
    const onType = (handler: (info: TypingInfo) => void) => {
        if (typeHandlers.current.includes(handler)) return;
        typeHandlers.current.push(handler)
    }
    const removeListener = (handler: Closure) => {
        receiveHandlers.current = receiveHandlers.current.filter(h => h !== handler);
    }
    const handler = useRef<ChatContextProvider | null>(null)
    useEffect(() => {
        if (!socket) return
        socket.on("new-message", (data) => {
            receiveHandlers.current.forEach(h => {
                h?.(data.data)
            })
            chats.current.push(data.data)
        });
        handler.current = {
            send: (e: ChatInfo) => send(e),
            addListener: (e: (chat: ChatInfo) => void) => onReceive(e),
            onType: (e: (chat: TypingInfo) => void) => onType(e),
            removeListener: (l: Closure) => removeListener(l),
            currentChats: () => chats.current
        }
    }, [send, socket]);

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