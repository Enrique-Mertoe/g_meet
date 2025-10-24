import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/root/lib/Session";

export async function POST(req: Request) {
    try {
        // Clear the session cookie
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE_NAME);

        return NextResponse.json({ ok: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { ok: false, error: "Logout failed" },
            { status: 500 }
        );
    }
}