declare interface WSRequest {
    event: string;
    action: string;
    identity: string;
    data: object;
}

declare interface WSResponse {
    event: string;
    identity: string;
    data: object;
}

declare interface MessageItemProps {
    sender: "me" | "them";
    id: string;
    message: string
}

declare interface MessageData {
    message: string
}

declare interface PresenterScroll {
    scroll_percent: number
}

declare interface PresenterMouse {
    x_percent: number;
    y_percent: number;
    aspect_ratio: number
}

declare interface ChatInfo {
    id: string;
    message: string;
    sender: string;
    file?: any
}

declare interface WSEndpoint {
    send: (request: WSRequest) => void
    onMessage: (handler: (response: WSResponse) => void) => void
    ready: () => boolean
    close: () => boolean
}

declare interface ChatContextProvider {
    send: (data: ChatInfo) => void;
    onReceive: (handler: (chat: ChatInfo) => void) => void;
    currentChats: () => ChatInfo[]
}

declare interface FileInfo {
    name: string;
    type: string;
    data:ArrayBuffer | string;
}