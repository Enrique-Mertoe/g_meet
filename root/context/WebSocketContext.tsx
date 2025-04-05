"use client"
// WebSocketContext.tsx
import React, {createContext, useContext, useEffect, useState} from "react";
import SignalBox from "@/root/manage/SignalBox";
import {closeWebSocketInstance, getWebSocketInstance} from "@/root/context/providers/WSInstanceProvider";

interface WSResponse {
    event: string;
    data: any;
}

// class WebSocketManager {
//     private static DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_API_URL ?? "wss://ws.kaigates.com";
//     ws: WebSocket;
//     ready: boolean = false;
//     receivedData: WSResponse | null = null;
//     private static inst: WebSocketManager | null = null;
//     private messageQueue: object[] = [];
//     private timeout: NodeJS.Timeout | null = null
//
//     constructor() {
//         this.ws = new WebSocket(WebSocketManager.DEFAULT_WS_URL);
//         this.setupWebSocketEvents()
//         // this.ws.onopen = () => {
//         //     console.log("WebSocket Connected");
//         //     this.ready = true;
//         // };
//         //
//         // this.ws.onclose = () => {
//         //     console.log("WebSocket Disconnected");
//         //     this.reconnect();
//         //     this.ready = false;
//         // };
//         //
//         // this.ws.onmessage = async (event) => {
//         //     try {
//         //         let text;
//         //         if (event.data instanceof Blob) {
//         //             text = await event.data.text();
//         //         } else {
//         //             text = event.data;
//         //         }
//         //         this.receivedData = JSON.parse(text);
//         //         this.triggerEvent();
//         //     } catch (error) {
//         //         console.error("Error parsing WebSocket message", error);
//         //     }
//         // };
//     }
//
//     private reconnect(interval: number = 3000) {
//         this.timeout && clearTimeout(this.timeout)
//         console.log("Attempting to reconnect WebSocket...");
//         this.timeout = setTimeout(() => {
//             this.ws = new WebSocket(WebSocketManager.DEFAULT_WS_URL);
//             this.setupWebSocketEvents();
//         }, interval);
//     }
//
//     private setupWebSocketEvents() {
//         this.ws.onopen = () => {
//             console.log("WebSocket Connected");
//             this.ready = true;
//             while (this.messageQueue.length > 0) {
//                 this.ws.send(JSON.stringify(this.messageQueue.shift()));
//             }
//         };
//
//         this.ws.onclose = () => {
//             console.log("WebSocket Disconnected. Reconnecting...");
//             this.ready = false;
//             this.reconnect();
//         };
//
//         // this.ws.onmessage = async (event) => {
//         //     try {
//         //         let text;
//         //         if (event.data instanceof Buffer) {
//         //             text = event.data.toString(); // Convert buffer to string
//         //         }
//         //         // Check if event.data is a Blob (binary large object)
//         //         else if (event.data instanceof Blob) {
//         //             text = await event.data.text(); // Read blob data as text
//         //         }
//         //         // Assume it's a string (this can be plain text)
//         //         else {
//         //             text = event.data;
//         //         }
//         //         this.receivedData = JSON.parse(text);
//         //         this.triggerEvent();
//         //     } catch (error) {
//         //         console.error("Error parsing WebSocket message", error);
//         //     }
//         // };
//     }
//
//     send = (data: WSRequest) => this.sendMessage(data);
//
//     private sendMessage = (data: object) => {
//         if (this.ws.readyState === WebSocket.OPEN) {
//             this.ws.send(JSON.stringify(data));
//         } else {
//             console.warn("WebSocket not open, queuing message.");
//             this.messageQueue.push(data);
//         }
//     };
//
//     triggerEvent() {
//         let action = this.receivedData?.event;
//         console.log(action)
//         SignalBox.trigger(action || "", this.receivedData);
//     }
//
//     static create() {
//         if (!WebSocketManager.inst) {
//             WebSocketManager.inst = new WebSocketManager()
//         }
//         return WebSocketManager.inst;
//     }
// }

// export const wsm = WebSocketManager

// interface WebSocketContextType {
//     wsm: WebSocketManager;
// }

// const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// export const WebSocketProvider: React.FC<{
//     children: React.ReactNode
// }> = ({children}) => {
//     const [wsm] = useState(WebSocketManager.create());
//
//     useEffect(() => {
//         return () => {
//             if (wsm.ws.readyState === WebSocket.OPEN) {
//                 wsm.ws.close();
//             }
//         };
//     }, []);
//
//     return (
//         <WebSocketContext.Provider value={{wsm}}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };

// export const useWebSocket = (): WebSocketManager => {
//     // const context = useContext(WebSocketContext);
//     // if (!context) {
//     //     throw new Error("useWebSocket must be used within a WebSocketProvider");
//     // }
//     const [wsm] = useState(WebSocketManager.create());
//
//     useEffect(() => {
//         return () => {
//             if (wsm.ws.readyState === WebSocket.OPEN) {
//                 wsm.ws.close();
//             }
//         };
//     }, [wsm]);
//     return wsm;
// };

