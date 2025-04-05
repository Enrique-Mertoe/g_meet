import SignalBox from "@/root/manage/SignalBox";
import {io} from "socket.io-client";

class WsProvider {
    private static _inst: WsProvider | null = null
    static DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_API_URL ?? "wss://ws.kaigates.com";
    private SIGNAL_TAG = "ws-message"
    private ws = io("http://localhost:3500", {
        withCredentials: true,
        transports: ['websocket'],
    });
    private _ready: boolean = false;
    private messageQueue: object[] = [];
    private timeout: NodeJS.Timeout | null = null

    constructor() {
        // this.ws = new WebSocket("ws://localhost:3500");
        this.setupWebSocketEvents();
        // this.ws.onopen
    }

    private reconnect(interval: number = 3000) {
        this.timeout && clearTimeout(this.timeout)
        console.log("Attempting to reconnect WebSocket...");
        this.timeout = setTimeout(() => {
            this.constructor()
        }, interval);
    }

    private setupWebSocketEvents() {

        this.ws.on("open", () => {
            this._ready = true;
            while (this.messageQueue.length > 0) {
                this.ws.send(JSON.stringify(this.messageQueue.shift()));
            }
        });

        this.ws.on("close", () => {
            this._ready = false;
            this.reconnect();

        });
        this.ws.on("message", async (event) => {

            try {
                let text;
                if (event.data instanceof Buffer) {
                    text = event.data.toString(); // Convert buffer to string
                }
                // Check if event.data is a Blob (binary large object)
                else if (event.data instanceof Blob) {
                    text = await event.data.text(); // Read blob data as text
                }
                // Assume it's a string (this can be plain text)
                else {
                    text = event.data;
                }
                this.triggerEvent(JSON.parse(text));
            } catch (error) {
                console.error("Error parsing WebSocket message", error);
            }
        });
    }

    private send(data: WSRequest) {
        // if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.emit("message", JSON.stringify(data));
        // } else {
        //     console.warn("WebSocket not open, queuing message.");
        //     this.messageQueue.push(data);
        // }

        return this;
    }

    private ready() {
        return this._ready;
    }

    private close() {
        this.ws.close()
        return false;
    }

    private onMessage(handler: (_: WSResponse) => void) {
        SignalBox.on(this.SIGNAL_TAG, handler)
    }


    private isWSResponse(obj: any): obj is WSResponse {
        return (
            obj &&
            obj.hasOwnProperty("event")
        );
    }

    private triggerEvent(parse: any) {
        if (this.isWSResponse(parse)) {
            SignalBox.trigger(this.SIGNAL_TAG, parse)
        }
    }

    static builder(): WSEndpoint {
        let inst = new WsProvider()
        return {
            close: () => inst.close(),
            onMessage: (e) => inst.onMessage(e),
            ready: () => inst.ready(),
            send: (e) => inst.send(e)
        }
    }

}

export default WsProvider

// export const useWebSocket = (): WSEndpoint => {
//     const [ws, setWs] = useState<WSEndpoint>(
//         WsProvider.builder()
//     );
//
//     useEffect(() => {
//         return () => {
//             ws.close()
//         }
//     }, []);
//     return ws
// }