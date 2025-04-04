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

declare interface MessageCarrier {
    id: string;
    message: string;
}