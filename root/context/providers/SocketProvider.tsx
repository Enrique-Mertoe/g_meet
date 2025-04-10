"use client"
import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {io, Socket} from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({socket: null});

export const SocketProvider = ({children}: { children: React.ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const [, setSReady] = useState(false)

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_WS_API_URL ?? 'https://ws.coolify.kaigates.com', {
            withCredentials: true,
            transports: ['websocket'],
        });
        setSReady(true)
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{socket: socketRef.current}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket
};
