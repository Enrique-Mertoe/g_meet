import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {WebSocketProvider} from "@/root/context/WebSocketContext";
import {Suspense} from "react";

export default function Home() {

    return (
        <div
            className="[family-name:var(--font-geist-sans)] h-screen w-screen">
            <main className={"h-full w-full"}>
                <WebSocketProvider>
                    <ComponentWrapper>
                        <Suspense>
                            <MainContent/>
                        </Suspense>
                    </ComponentWrapper>
                </WebSocketProvider>
            </main>
        </div>
    );
}


