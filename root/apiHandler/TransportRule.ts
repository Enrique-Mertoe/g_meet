import {Transport, TransportOptions, TResponseInfo} from "@/root/apiHandler/index";
import axios from "axios";
import {ApiResponseData} from "@/root/GTypes";

function BuildRes<T>({
                         success = false, data,
                         message
                     }: TResponseInfo<T>): TResponseInfo<T> {
    return {
        success, data, message
    }
}

declare type AData<T> = {
    ok: boolean
    data?: T;
    message?: string;
}

export default function TransportRule<T>(options: TransportOptions): Transport<T> {
    async function make(): Promise<TResponseInfo<T>> {
        try {
            const res = await axios.post(options.url, options.carrier, {
                withCredentials: true,
            });
            if (res.status !== 200) {
                return BuildRes({})
            }
            const resData = res.data as AData<T>
            return BuildRes({
                success: resData.ok,
                data: resData.data,
                message: resData.message
            })
        } catch (err) {
            // console.log(err.message)
            return BuildRes({})
        }
    }

    return {
        async make(): Promise<TResponseInfo<T>> {
            return await make()
        },
        abort() {

        }
    }
}