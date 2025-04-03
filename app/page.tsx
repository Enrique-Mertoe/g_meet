import ComponentWrapper, {MainContent} from "@/root/ui/components/Layout/ComponentWrapper";

export default function Home() {

    return (
        <div
            className="[family-name:var(--font-geist-sans)] h-screen w-screen">
            <main className={"h-full w-full"}>
                <ComponentWrapper>
                    <MainContent/>
                </ComponentWrapper>
            </main>
        </div>
    );
}


