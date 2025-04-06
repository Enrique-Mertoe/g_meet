"use client"
import React from "react";
import AppInitProvider from "@/root/context/providers/AppInitProvider";
import {SocketProvider} from "@/root/context/providers/SocketProvider";
import {DetailScreenProvider} from "@/root/context/providers/DetailScreenProvider";
import {PresentProvider} from "@/root/context/providers/PresentProvider";
import {DialogProvider} from "@/root/ui/components/Dialogs/DialogProvider";

const AppContext: React.FC<{
    children: React.ReactNode
}> = ({children}) => {
    return (
        <>
            <SocketProvider>
                <AppInitProvider>
                    <DialogProvider>
                        <DetailScreenProvider>
                            <PresentProvider>
                                {children}
                            </PresentProvider>
                        </DetailScreenProvider>
                    </DialogProvider>
                </AppInitProvider>
            </SocketProvider>
        </>
    )
}
export default AppContext;