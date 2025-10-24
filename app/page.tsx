import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";
import {Suspense} from "react";
import AppContext from "@/root/context/AppContext";
import session from "@/root/lib/Session";
import {redirect} from "next/navigation";
import DashBoard from "@/root/ui/components/dashboard/dashboard";

export default async function Home() {
    if (!await session("user"))
        return redirect("/landing");
    return (
        <AppContext>
            <div
                className="[family-name:var(--font-geist-sans)] h-screen w-screen">
                <main className={"h-full w-full"}>
                    <ComponentWrapper>
                        <Suspense>
                            <DashBoard/>
                        </Suspense>
                    </ComponentWrapper>

                </main>
            </div>
        </AppContext>
    );
}


