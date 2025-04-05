import React from "react";
import AppInitProvider from "@/root/context/providers/AppInitProvider";
import {DetailScreenProvider} from "@/root/context/providers/DetailScreenProvider";
import {ChatProvider} from "@/root/context/providers/ChatProvider";

const DScreenContext: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    return (
        <ChatProvider>
            {children}
        </ChatProvider>
    )
}
export default DScreenContext
