// import {useEffect, useRef, useState} from "react";
//
// type WebSocketHook = {
//     sendMessage: (data: object) => void;
//     isConnected: boolean;
//     receivedData: WSResponse | null
// };
//
//
// const DEFAULT_WS_URL = "ws://localhost:3500";
//
// const useWebSocket = (url = DEFAULT_WS_URL): WebSocketHook => {
//     const ws = useRef<WebSocket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const [receivedData, setReceivedData] = useState<WSResponse | null>(null);
//
//     useEffect(() => {
//         ws.current = new WebSocket(url);
//
//         ws.current.onopen = () => {
//             console.log("WebSocket Connected");
//             setIsConnected(true);
//         };
//
//         ws.current.onclose = () => {
//             console.log("WebSocket Disconnected");
//             setIsConnected(false);
//         };
//         ws.current.onmessage = async (event) => {
//             try {
//                 let text;
//                 if (event.data instanceof Blob) {
//                     text = await event.data.text()
//                 } else
//                     text = event.data
//                 const parsedData = JSON.parse(text);
//                 setReceivedData(parsedData);
//             } catch (error) {
//                 console.error("Error parsing received data:", error);
//             }
//         };
//
//         return () => {
//             ws.current?.close();
//         };
//     }, [url]);
//
//     const sendMessage = (data: object) => {
//         if (ws.current?.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify(data));
//         }
//     };
//
//     return {sendMessage, isConnected, receivedData};
// };
//
// export default useWebSocket;
