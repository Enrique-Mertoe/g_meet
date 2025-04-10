import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "About",
    description: "Generated by create next app",
};

export default function AboutLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}