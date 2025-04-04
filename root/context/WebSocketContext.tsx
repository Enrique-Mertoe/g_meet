"use client"
// WebSocketContext.tsx
import React, {createContext, useContext, useEffect, useState} from "react";
import SignalBox from "@/root/manage/SignalBox";

interface WSResponse {
    event: string;
    data: any;
}

// WebSocketManager class (can remain unchanged)
class WebSocketManager {
    private static DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_API_URL ?? "";
    ws: WebSocket;
    ready: boolean = false;
    receivedData: WSResponse | null = null;

    constructor() {
        this.ws = new WebSocket(WebSocketManager.DEFAULT_WS_URL);

        this.ws.onopen = () => {
            console.log("WebSocket Connected");
            this.ready = true;
        };

        this.ws.onclose = () => {
            console.log("WebSocket Disconnected");
            this.ready = false;
        };

        this.ws.onmessage = async (event) => {
            try {
                let text;
                if (event.data instanceof Blob) {
                    text = await event.data.text();
                } else {
                    text = event.data;
                }
                this.receivedData = JSON.parse(text);
                this.triggerEvent();
            } catch (error) {
                console.error("Error parsing WebSocket message", error);
            }
        };
    }

    send = (data: WSRequest) => this.sendMessage(data);

    private sendMessage = (data: object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    };

    triggerEvent() {
        let action = this.receivedData?.event;
        SignalBox.trigger(action || "", this.receivedData);
    }
}

interface WebSocketContextType {
    wsm: WebSocketManager;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    const [wsm] = useState(new WebSocketManager());

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (wsm.ws) {
                wsm.ws.close();
            }
        };
    }, [wsm]);

    return (
        <WebSocketContext.Provider value={{wsm}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketManager => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context.wsm;
};
