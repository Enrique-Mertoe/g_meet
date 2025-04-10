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
    return NextResponse.next()
}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}