import React, {useEffect, useState} from "react";

const MessageItem: React.FC<MessageItemProps> = ({sender, message}) => {
    const _from = sender === "me" ? "from-me" : "from-them";
    const [show,setShow] =useState(false)

    useEffect(() => {
        setShow(true)
    }, []);

    return (
        <p className={`${_from} text-sm transform transition-all duration-300 ${!show&&"h-0 hidden"}`}>
            {message}
        </p>
    );
};

export default MessageItem