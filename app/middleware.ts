import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    const url = req.url;

    // Check if the request method is GET
    if (url.includes("/api/") && req.method === "GET") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}