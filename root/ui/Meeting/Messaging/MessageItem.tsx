import React, {useEffect, useState} from "react";
import {ChatInfo} from "@/root/GTypes";

const MessageItem: React.FC<{ info: ChatInfo }> = ({info}) => {
    const _from = info.sender === "me" ? "from-me" : "from-them";
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(true)
    }, []);

    return (
        <div className={`${_from} text-sm msg transform transition-all duration-300 ${!show && "h-0 hidden"}`}>
            {/*<div>*/}
            {/*    {info.files?.map(f => (*/}
            {/*        <>*/}
            {/*            <img src={f.data} alt={f.name}/>*/}
            {/*        </>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {info.files?.length}
            {info.message}
        </div>
    );
};

export default MessageItem