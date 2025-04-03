import React from "react";

const MessageItem: React.FC<MessageItemProps> = ({sender, message}) => {
    const _from = sender === "me" ? "from-me" : "from-them";

    return (
        <p className={`${_from} text-sm`}>
            {message}
        </p>
    );
};

export default MessageItem