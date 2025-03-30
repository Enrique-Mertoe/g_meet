import GContainer, {ContainerContent} from "@/app/components/widgets/GContainer";

export default function Home() {

    return (
        <div
            className="[family-name:var(--font-geist-sans)] bg-dark2">
            <main>
                <GContainer>
                    <ContainerContent/>
                </GContainer>
            </main>
        </div>
    );
}
