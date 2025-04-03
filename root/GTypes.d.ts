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

    message: string
}

declare interface MessageData{
    message:string
}