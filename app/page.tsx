import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {Suspense} from "react";
import AppContext from "@/root/context/AppContext";

export default function Home() {

    return (
        <AppContext>
            <div
                className="[family-name:var(--font-geist-sans)] h-screen w-screen">
                <main className={"h-full w-full"}>
                    <ComponentWrapper>
                        <Suspense>
                            <MainContent/>
                        </Suspense>
                    </ComponentWrapper>

                </main>
            </div>
        </AppContext>
    );
}


