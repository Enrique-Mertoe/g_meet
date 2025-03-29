import VScreen from "@/app/components/VScreen";
import GCard from "@/app/components/GCard";
import GControl from "@/app/components/GControl";
import GContainer from "@/app/components/widgets/GContainer";

export default function Home() {
    const userDetails = {
            name: "John Doe",
            avatar: "/avatar.jpg",
            isSpeaking: true,
            micOn: false
        },
        presentationDetails = {
            title: "Live Presentation",
            content: (<iframe src="https://example.com/presentation" className="w-full h-full"/>)
        };
    return (
        <div
            className="[family-name:var(--font-geist-sans)]">
            <main>
                <GContainer>
                    <VScreen>
                        <GCard info={userDetails} type={"user"}/>
                        <GCard type="presentation" info={presentationDetails}/>
                    </VScreen>
                    <GControl/>
                </GContainer>
            </main>
        </div>
    );
}
