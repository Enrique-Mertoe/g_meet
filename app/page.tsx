import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {Suspense} from "react";
import AppContext from "@/root/context/AppContext";
import session from "@/root/lib/Session";
import {redirect} from "next/navigation";

export default async function Home() {
    if (!await session("user1"))
        return redirect("/landing");
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


