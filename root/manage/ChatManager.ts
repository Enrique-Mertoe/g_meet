import SignalBox from "@/root/manage/SignalBox";
import {acc} from "@/root/manage/useUserManager";
import {generateMeetID} from "@/root/utility";
import {MessageData, MessageItemProps, WSResponse} from "@/root/GTypes";

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
            id: generateMeetID()
        };
        this._chats.push(newMessage)
        this._sendSignal(newMessage)

    };

    private handleMessageSignal = (data: WSResponse) => {
        if(acc.user())
        this.appendMessage(data)
    }
    messages = () => {
        return this._chats
    }

    private _sendSignal(message: MessageItemProps) {
        // Chat.windowSignal == "on" &&
        SignalBox.trigger("msg", message)
    }
}

export const Chat = new ChatManager()