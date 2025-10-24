"use client"
import React, {useState, useEffect} from 'react';
import Image from "next/image";
import loginBg from "@/public/loginbg.svg"
import GIcon from "@/root/ui/components/Icons";
import {useSignIn} from "@/root/hooks/useSignIn";
import {useRouter, useSearchParams} from "next/navigation";

const SignInPage: React.FC = () => {
    const su = useSignIn()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return;
        setLoading(true)
        if (!email || !password) {
            setErrorMessage('Please fill out all fields.');
            setLoading(false)
            return
        }
        const res = await su.signIn({email, password});
        setLoading(false)
        setErrorMessage(prev => res.error ? res.error : prev)
        console.log(res)
        if (res.ok){
            // Check if there's a redirect parameter
            const redirect = searchParams.get('redirect')
            if (redirect) {
                router.push(redirect)
            } else {
                router.push('/')
            }
        }

    };

    return (
        <main className="w-full h-screen bg-gray-100 flex items-center justify-center py-4">
            <div className="w-full max-w-3xl bg-white text-dark p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">
                            Hey there!<br/>Welcome back.
                        </h2>
                        <div className="flex justify-center">
                            <Image
                                alt="Illustration"
                                src={loginBg}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="w-1/2 px-6 py-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="si-email" className="text-sm font-medium">Email address</label>
                                <input
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                    type="email"
                                    id="si-email"
                                    className="w-full p-3 mt-2 bg-gray-100 transition-all duartion-500 ring-1 text-dark rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="text-red-500 text-sm mt-1">{!email && errorMessage}</div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="si-password" className="text-sm font-medium">Password</label>
                                    <a href="/signin-dark#" className="text-sm text-blue-400 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    id="si-password"
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    type="password"
                                    className="w-full p-3 mt-2 bg-gray-100 transition-all duartion-500 ring-1 text-dark rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-red-500 text-sm mt-1">{!password && errorMessage}</div>
                            </div>

                            {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}

                            <button
                                type="submit"
                                className={` transition-all duration-200 ease-in-out ms-auto cursor-pointer h-[45px] ${loading ? " p-3 !rounded-full w-[45px]" : "w-full py-3 px-4"} 
                                mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center`}
                            >
                                {!loading && <span className={"whitespace-nowrap"}>
                                    Sign In
                                </span>}
                                {
                                    loading && <span className="">
                                  <GIcon name={"g-loader"} color={"current-color"}/>
                                </span>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignInPage;
