import ComponentWrapper, {MainContent} from "@/app/components/widgets/ComponentWrapper";

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
