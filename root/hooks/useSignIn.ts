import {useState} from "react";
import axios from "axios";
import {FetchResponse} from "@/root/GTypes";

type SignInData = {
    email: string;
    password: string;
};

type SignInResponse = FetchResponse<object> & {};

export const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signIn = async ({email, password}: SignInData): Promise<SignInResponse> => {
        setError(null);
        try {
            const response = await axios.post('/api/auth/authorization', {
                email,
                password,
            });
            console.log(response.data)
            return response.data;
        } catch (err: any) {
            const errMsg =
                err.response?.data?.error ||
                err.message ||
                'An unexpected error occurred';

            return {ok: false, error: errMsg};
        }
    };

    return {signIn, loading, error};
};