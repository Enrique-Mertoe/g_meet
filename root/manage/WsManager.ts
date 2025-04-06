import SignalBox from "@/root/manage/SignalBox";
import {WSResponse} from "@/root/GTypes";


class WebSocketManager {
    private static DEFAULT_WS_URL = "ws://localhost:3500";
    ws: WebSocket
    ready: boolean = false

    receivedData: WSResponse | null = null

    constructor() {
        const ws = new WebSocket(WebSocketManager.DEFAULT_WS_URL);
        this.ws = ws

        this.ws.onopen = () => {
            console.log("WebSocket Connected");
            this.ready = true;
        };

        this.ws.onclose = () => {
            console.log("WebSocket Disconnected");
            this.ready = false;
        };

        ws.onmessage = async (event) => {
            try {
                let text;
                if (event.data instanceof Blob) {
                    text = await event.data.text()
                } else
                    text = event.data
                this.receivedData = JSON.parse(text);

                this.triggerEvent()
            } catch (error) {
            }
        };
    }

    send = (data: object) => this.sendMessage(data)
    private sendMessage = (data: object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    };

    triggerEvent() {
        const action = this.receivedData?.event
        alert(action)
        SignalBox.trigger(action ?? "ws3", this.receivedData)
    }
}
