import MeetingPage from "@/app/meeting/[meetingId]/page.view";
import session from "@/root/lib/Session";
import {redirect} from "next/navigation";

export default async function Page({params}: any) {
    const {meetingId} = await params;

    // Check if user is authenticated
    const user = await session("user");
    if (!user) {
        return redirect(`/auth/login?redirect=/meeting/${meetingId}`);
    }
    return <MeetingPage meetingId={meetingId} user={user}/>
}