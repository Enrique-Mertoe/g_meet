import useWebSocket from "@/root/hooks/useWebSocket";
import {useEffect} from "react";
import SignalBox from "@/root/manage/SignalBox";

type WSManagerType = {
    send: (data: WSRequest) => void,
    ready: boolean
}
const WSManager = (): WSManagerType => {
    const ws = useWebSocket();
    const eventHandlers: Record<string, Function[]> = {};
    const send = (data: object) => ws.sendMessage(data)

    useEffect(() => {
        let action = ws.receivedData?.event
        SignalBox.trigger(action ?? "ws", ws.receivedData)
    }, [ws.receivedData]);
    return {
        send,
        ready: ws.isConnected
    }
}
export default WSManager