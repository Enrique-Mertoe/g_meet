import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Welcome back!",
    description: "Login to SMV meet",
};

export default function AuthPage({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}