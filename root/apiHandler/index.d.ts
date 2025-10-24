import {Closure} from "@/root/GTypes";

export type SignInInfo = {
    email: string;
    password: string
}

export interface Task<T> {
    onComplete: (data: T) => void
}

export type UserData = {
    email: string;
    fullname: string;
    profileUrl: string;
}
export type AuthType = {
    signin: (info: SignInInfo) => Promise<TResponseInfo<AuthInfo>>
}
export type TransportOptions = {
    url: string;
    carrier: Carrier
}
export type Carrier = {
    event: string;
    action: string;
    data: object
}
export type Transport<T> = {
    make: () => Promise<TResponseInfo<T>>;
    abort: Closure
}
export declare type AuthInfo = {
    auth_token: string,
    refresh_token: string,
    user: UserData
}
export type TResponseInfo<T> = {
    success?: boolean;
    data?: T;
    message?: string;
}

export type ApiSessionMixin = {
    set: <T>(id: string, key: string, value: T) => Promise<void>
    get: <T>(id: string, key: string, default_value: T | null) => Promise<T | null>;
    init: (id: string) => Promise
}
export type  ApiAppProviderContext = {
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

// Meeting Types
export type MeetingParticipant = {
    userId: string;
    joinedAt: Date;
    leftAt?: Date;
    role: 'host' | 'co-host' | 'participant';
    isMuted: boolean;
    isVideoOff: boolean;
}

export type MeetingSettings = {
    isWaitingRoomEnabled: boolean;
    isChatEnabled: boolean;
    isScreenShareEnabled: boolean;
    isRecordingEnabled: boolean;
    maxParticipants: number;
    requirePassword: boolean;
    password?: string;
}

export type MeetingData = {
    meetingId: string;
    title: string;
    description?: string;
    hostId: string | UserData;
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    status: 'scheduled' | 'active' | 'ended' | 'cancelled';
    type: 'instant' | 'scheduled';
    participants: MeetingParticipant[];
    settings: MeetingSettings;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateMeetingData = {
    userId: string;
    title?: string;
}

export type ScheduleMeetingData = {
    userId: string;
    title: string;
    description?: string;
    scheduledAt: Date | string;
    duration?: number;
    settings?: Partial<MeetingSettings>;
}

export type JoinMeetingData = {
    userId: string;
    meetingId: string;
    password?: string;
}

export type MeetingActionData = {
    userId: string;
    meetingId: string;
}

export type GetMeetingsData = {
    userId: string;
    limit?: number;
}

export type MeetingType = {
    "create-instant": (data: CreateMeetingData) => Promise<TResponseInfo<MeetingData>>;
    schedule: (data: ScheduleMeetingData) => Promise<TResponseInfo<MeetingData>>;
    get: (data: { meetingId: string }) => Promise<TResponseInfo<MeetingData>>;
    join: (data: JoinMeetingData) => Promise<TResponseInfo<MeetingData>>;
    leave: (data: MeetingActionData) => Promise<TResponseInfo<any>>;
    end: (data: MeetingActionData) => Promise<TResponseInfo<any>>;
    upcoming: (data: GetMeetingsData) => Promise<TResponseInfo<MeetingData[]>>;
    recent: (data: GetMeetingsData) => Promise<TResponseInfo<MeetingData[]>>;
    active: (data: GetMeetingsData) => Promise<TResponseInfo<MeetingData[]>>;
}