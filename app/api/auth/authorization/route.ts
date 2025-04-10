import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {ApiResponseData, FetchResponse} from "@/root/GTypes";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {api} from "@/root/apiHandler/ApiHandler";
import session from "@/root/lib/Session";

function makeRes<T>({ok = false, data, error, message}: FetchResponse<T>) {

    return NextResponse.json({ok, data, error, message})
}

// function apiRes<T>({
//                        ok = false, data,
//                        message
//                    }: ApiResponseData<T>): ApiResponseData<T> {
//     return {
//         ok, data, message
//     }
// }
//
// declare type AData<T> = {
//     ok: boolean
//     data?: T;
//     message?: string;
// }
//
// async function apiDispatcher<T>(data: object): Promise<ApiResponseData<T>> {
//     const apiResponse = await axios.post('http://localhost:3500/api/auth/signin', data, {
//         withCredentials: true,
//     });
//     if (apiResponse.status !== 200)
//         return apiRes({message: "Something went wrong"})
//     const resData = apiResponse.data as AData<T>
//     return {
//         ok: resData.ok,
//         data: resData.data,
//         message: resData.message
//     }
// }

export async function POST(req: Request) {
    const {email, password} = await req.json();
    console.log((await cookies()).getAll())

    if (!email || !password)
        return makeRes({ok: false, error: "All fields are required!"})
    try {
        // const res = await apiDispatcher<AuthInfo>({
        //     event: "auth",
        //     action: "signin",
        //     data: {
        //         email,
        //         password,
        //     }
        // })
        const res = await api.auth().signin({email, password})
        if (!res.success || !res.data) {
            return makeRes({error: res.message})
        }
        await session({
            "jwt": res.data.auth_token,
            "jwt_refresh": res.data.refresh_token,
            "user": res.data.user
        })
        return makeRes({ok: true})
    } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = error.response?.data?.error || 'Login failed';

        return makeRes({error: encodeURIComponent(msg)})
    }
}

