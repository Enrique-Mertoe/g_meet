import {ConfirmHandler} from "@/root/ui/components/Dialogs/Alert";
import {decl} from "postcss";
import * as async_hooks from "node:async_hooks";

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
    time: number;
    files?: FileInfo[]
}

declare interface TypingInfo {
    id: string;
    userId: string;
    chatId: string;
    status: boolean
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
    onType: (handler: (chat: TypingInfo) => void) => void;
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
    pick: (fn: (file: FileInfo[]) => void) => void;
}

declare interface ApplicationProp {
    nm?: unknown
}

declare interface DialogBuilder {
    onDismiss: () => DialogBuilder | void;
    onOpen: () => DialogBuilder | void;
    dismiss: () => DialogBuilder | void;
    show: () => void;
    setView: (view: React.ReactNode) => DialogBuilder | void;
}

declare type Closure = (...args) => void;

declare type FetchResponse<T> = {
    ok?: boolean;
    data?: T;
    error?: string;
    message?: string;
}

declare type ApiResponseData<T> = {
    ok?: boolean;
    data?: T;
    message?: string;
}


type SessionManager = {
    set: <T>(key: string, value: T) => Promise<void>;
    get: <T>(key: string, default_value?: T | null) => Promise<T | null | undefined>;
}

type SessionPayload = {
    data: string | Dict;
    expires: Date
}

type Dict<T = unknown> = Record<string, T>