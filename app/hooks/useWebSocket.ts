import { useEffect, useRef, useState } from "react";

type WebSocketHook = {
  sendMessage: (data: object) => void;
  isConnected: boolean;
};

const useWebSocket = (url: string): WebSocketHook => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const sendMessage = (data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { sendMessage, isConnected };
};

export default useWebSocket;
