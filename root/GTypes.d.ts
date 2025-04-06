import {ConfirmHandler} from "@/root/ui/components/Dialogs/Alert";
import {decl} from "postcss";

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
    file?: FileInfo
}

declare interface WSEndpoint {
    send: (request: WSRequest) => void
    onMessage: (handler: (response: WSResponse) => void) => void
    ready: () => boolean
    close: () => boolean
}

declare interface ChatContextProvider {
    send: (data: ChatInfo) => void;
    addListener: (handler: (chat: ChatInfo) => void) => void;
    currentChats: () => ChatInfo[];
    removeListener: (listener: Closure) => void;
}

declare interface FileInfo {
    name: string;
    type: string;
    data: ArrayBuffer | string;
}

declare interface PresentationDelegate {
    onMouseMove(position: PMParams): void

    sendMouseCoordinates(position: PMParams): void

    onScrollChange(params: PSParams): void

    sendScrollCoordinates(params: PSParams): void
}

declare interface PMParams {
    x: number;
    y: number
}

declare interface PSParams {
    offset: number
}

declare interface MediaPickerType {
    pick: (handler: (file: File) => void) => void;
}

declare interface ApplicationProp {

}

declare interface DialogBuilder {
    onDismiss: () => DialogBuilder | void;
    onOpen: () => DialogBuilder | void;
    dismiss: () => DialogBuilder | void;
    show: () => void;
    setView: (view: React.ReactNode) => DialogBuilder | void;
}

declare type Closure = (...args) => void;