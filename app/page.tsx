import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {WebSocketProvider} from "@/root/context/WebSocketContext";

export default function Home() {

    return (
        <div
            className="[family-name:var(--font-geist-sans)] h-screen w-screen">
            <main className={"h-full w-full"}>
                <WebSocketProvider>
                    <ComponentWrapper>
                        <MainContent/>
                    </ComponentWrapper>
                </WebSocketProvider>
            </main>
        </div>
    );
}


