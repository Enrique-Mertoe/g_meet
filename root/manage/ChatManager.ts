import SignalBox from "@/root/manage/SignalBox";
import {acc} from "@/root/manage/useUserManager";
import {absolutePathToPage} from "next/dist/shared/lib/page-path/absolute-path-to-page";

class ChatManager {
    private _chats: MessageItemProps[] = []
    windowSignal: "on" | "off" = "off"

    constructor() {
        SignalBox.on("message", this.handleMessageSignal)
    }

    private appendMessage = (data: WSResponse) => {
        const newMessage: MessageItemProps = {
            sender: data.identity === acc.user()?.uid ? "me" : "them",
            message: (data.data as MessageData)["message"],
        };
        this.messages(newMessage)


    };

    private handleMessageSignal = (data: WSResponse) => {
        acc.user() &&
        this.appendMessage(data)
    }
    messages = (message?: MessageItemProps) => {
        if (!message)
            return this._chats
        this._chats.push(message)
        this._sendSignal(message)
        return this._chats
    }

    private _sendSignal(message: MessageItemProps) {
        // Chat.windowSignal == "on" &&
        SignalBox.trigger("msg", message)
    }
}

export const Chat = new ChatManager()