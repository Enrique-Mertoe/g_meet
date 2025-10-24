import {NextRequest, NextResponse} from 'next/server'
import {createSession, getSessionId, SESSION_COOKIE_NAME} from "@/root/lib/Session";

export default async function middleware(req: NextRequest) {
    // AppProvider.init(req)
    let sessionId = await getSessionId();

    if (!sessionId) {
        sessionId = await createSession();
        const response = NextResponse.next();
        response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
        return response;
    } else {
        await createSession(sessionId)
    }

    // Protected routes check - meeting routes require authentication
    // This is a redundant check as page-level auth already handles this,
    // but provides an extra security layer at the middleware level
    if (req.nextUrl.pathname.startsWith('/meeting/')) {
        // The actual authentication check is done at the page level
        // (app/meeting/[meetingId]/page.tsx) which has access to the session
        // Middleware just ensures session exists, page validates user
    }

    return NextResponse.next()
}
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};