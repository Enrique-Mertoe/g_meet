import {NextResponse} from "next/server";
import {api} from "@/root/apiHandler/ApiHandler";
import session from "@/root/lib/Session";

function makeRes<T>({ok = false, data, error, message}: {
    ok?: boolean;
    data?: T;
    error?: string;
    message?: string
}) {
    return NextResponse.json({ok, data, error, message});
}

// Create instant meeting
export async function POST(req: Request) {
    try {
        const user = await session("user");
        if (!user) {
            return makeRes({error: "Unauthorized"});
        }

        const body = await req.json();
        const {action, ...data} = body;

        if (!action) {
            return makeRes({error: "Action is required"});
        }

        // Call the meeting API with the action
        //@ts-ignore
        const res = await api.meeting()[action]({userId: user._id, ...data});

        if (!res.success || !res.data) {
            return makeRes({error: res.message});
        }

        return makeRes({ok: true, data: res.data, message: res.message});
    } catch (error: unknown) {
        console.error("Meeting API error:", error);
        return makeRes({error: "Failed to process meeting request"});
    }
}

// Get meetings (upcoming, recent, active) or single meeting
export async function GET(req: Request) {
    try {
        const user = await session("user");
        console.log("uu__", user)
        if (!user) {
            return makeRes({error: "Unauthorized"});
        }

        const {searchParams} = new URL(req.url);
        const type = searchParams.get("type") || "upcoming";
        const meetingId = searchParams.get("meetingId");
        const limit = searchParams.get("limit");

        let res;
        //@ts-ignore
        const userId = user._id;

        switch (type) {
            case "get":
                // Get single meeting by ID
                if (!meetingId) {
                    return makeRes({error: "Meeting ID is required"});
                }
                res = await api.meeting().get({meetingId});
                break;
            case "upcoming":
                res = await api.meeting().upcoming({userId});
                break;
            case "recent":
                res = await api.meeting().recent({userId, limit: limit ? parseInt(limit) : undefined});
                break;
            case "active":
                res = await api.meeting().active({userId});
                break;
            default:
                return makeRes({error: "Invalid meeting type"});
        }

        if (!res.success) {
            return makeRes({error: res.message});
        }

        return makeRes({ok: true, data: res.data});
    } catch (error: unknown) {
        console.error("Get meetings error:", error);
        return makeRes({error: "Failed to get meetings"});
    }
}

// Update/End meeting
export async function PUT(req: Request) {
    try {
        const user = await session("user");
        if (!user) {
            return makeRes({error: "Unauthorized"});
        }

        const body = await req.json();
        const {action, meetingId, ...data} = body;

        if (!action || !meetingId) {
            return makeRes({error: "Action and meetingId are required"});
        }

        const res = await api.meeting()[action]({
            //@ts-ignore
            userId: user._id,
            meetingId,
            ...data
        });

        if (!res.success) {
            return makeRes({error: res.message});
        }

        return makeRes({ok: true, data: res.data, message: res.message});
    } catch (error: unknown) {
        console.error("Update meeting error:", error);
        return makeRes({error: "Failed to update meeting"});
    }
}