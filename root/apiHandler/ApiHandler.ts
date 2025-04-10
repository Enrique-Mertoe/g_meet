import TransportRule from "@/root/apiHandler/TransportRule";
import {
    ApiAppProviderContext,
    ApiSessionMixin,
    AuthInfo,
    AuthType, ISession,
    SignInInfo,
    TResponseInfo,
    UserData
} from "@/root/apiHandler/index";
import {cookies, headers} from "next/headers";
import {NextRequest} from "next/server";
import {v4 as uuidv4} from 'uuid';
import {decrypt, encrypt, getSessionId, Session} from "@/root/lib/Session";
import {Dict, SessionPayload} from "@/root/GTypes";
import {json} from "node:stream/consumers";

const ApiAuth = (): AuthType => {
    return {
        async signin(info: SignInInfo): Promise<TResponseInfo<AuthInfo>> {
            return await TransportRule<AuthInfo>({
                url: 'http://localhost:3500/api/auth',
                carrier: {
                    event: "auth",
                    action: "signin",
                    data: info
                }
            }).make();
        }

    }
}

export async function getClientIp(): Promise<string> {
    const forwarded = (await headers()).get('x-forwarded-for');
    if (forwarded) {
        const ip = forwarded.split(',')[0].trim();
        return ip === "::1" ? '127.0.0.1' : (ip ?? "unknown")
    }
    let realIp = (await headers()).get('x-real-ip');
    realIp = realIp === "::1" ? '127.0.0.1' : realIp
    return realIp || "unknown";
}

const ApiAppProvider = (): ApiAppProviderContext => {
    return {
        async initApp(req: NextRequest): Promise<void> {
            const cc = await cookies();

            if (!cc.get("session")?.value) {
                const cookieStore = await cookies()
                const id = uuidv4();


                console.log()
                cookieStore.set("session", id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    sameSite: 'lax',
                    path: '/',
                })

            } else {
                console.log("cookie presnet")
            }
        }
    }
}

let i = 0;

async function initSession(id: string) {
    console.log(1)
    ++i
    const ip = await getClientIp();
    const userAgent = (await headers()).get('user-agent') || 'unknown';
    const d = await TransportRule<{ session: string }>({
        url: 'http://localhost:3500/api/auth',
        carrier: {
            event: "auth",
            action: "session-init",
            data: {
                ip_address: ip, ses_id: id, user_agent: userAgent, payload: await encrypt({
                    data: JSON.stringify({}),
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
            }
        }
    }).make();
}

type SessData = {
    ses_id: string;
    user_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    payload: string | SessionPayload;
    last_activity: number;
}


async function createSession<T>(id: string, key: string, value: T) {
    let current_session: SessData | null = null;

    const d = await TransportRule<SessData>({
        url: 'http://localhost:3500/api/auth',
        carrier: {
            event: "auth",
            action: "session-get",
            data: {
                ses_id: id,
            }
        }
    }).make();

    if (!d.success || !d.data) {
        return
    }
    const payload: SessionPayload = (await decrypt(d.data.payload as string)) as SessionPayload
    payload.data = JSON.parse(payload.data as string)


    current_session = {
        ...(d.data ?? {}),
        payload
    }
    const payload1 = current_session.payload as SessionPayload;
    const new_data = payload1.data as Dict;
    new_data[key] = value;
    payload1.data = JSON.stringify(new_data);

    await TransportRule<SessData>({
        url: 'http://localhost:3500/api/auth',
        carrier: {
            event: "auth",
            action: "session-update",
            data: {
                ses_id: id,
                payload: await encrypt(payload1)
            }
        }
    }).make();

}

async function getSession<T>(id: string, key: string, default_val: T | null) {
    const d = await TransportRule<SessData>({
        url: 'http://localhost:3500/api/auth',
        carrier: {
            event: "auth",
            action: "session-get",
            data: {
                ses_id: id,
            }
        }
    }).make();

    if (!d.success || !d.data) {
        return
    }
    const payload: SessionPayload = (await decrypt(d.data.payload as string)) as SessionPayload
    return JSON.parse(payload.data as string)[key] ?? default_val
}

const ApiSession = (): ApiSessionMixin => {
    return {
        async set(id: string, key, value) {
            return await createSession(id, key, value);
        },
        async get<T>(id: string, key: string, default_val: T | null): Promise<T | null> {
            return await getSession(id, key, default_val)
        },
        async init(id: string) {
            await initSession(id)
        }
    }
}
export const api = {
    auth: () => ApiAuth(),
    app: ApiAppProvider(),
    session: ApiSession()
}