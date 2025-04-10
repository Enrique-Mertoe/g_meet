import {Closure} from "@/root/GTypes";

type SignInInfo = {
    email: string;
    password: string
}

interface Task<T> {
    onComplete: (data: T) => void
}

type UserData = {
    email: string;
    fullname: string;
    profileUrl: string;
}
type AuthType = {
    signin: (info: SignInInfo) => Promise<TResponseInfo<AuthInfo>>
}
type TransportOptions = {
    url: string;
    carrier: Carrier
}
type Carrier = {
    event: string;
    action: string;
    data: object
}
type Transport<T> = {
    make: () => Promise<TResponseInfo<T>>;
    abort: Closure
}
declare type AuthInfo = {
    auth_token: string,
    refresh_token: string,
    user: UserData
}
type TResponseInfo<T> = {
    success?: boolean;
    data?: T;
    message?: string;
}

type ApiSessionMixin = {
    set: <T>(id: string, key: string, value: T) => Promise<void>
    get: <T>(id: string, key: string, default_value: T | null) => Promise<T | null>;
    init: (id: string) => Promise
}
type  ApiAppProviderContext = {
    initApp: Closure
}

export interface ISession extends Document {
    id: string;
    user_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    payload: string;
    last_activity: number;
}