import type {Metadata} from "next";
import React from "react";
import {Geist, Geist_Mono} from "next/font/google";

export const metadata: Metadata = {
    title: "Academic Online conference",
    description: "Your Virtual Classroom, Reinvented for the Modern Academic World",
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export default function LandingLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <link rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>

            {children}
        </>
    );
}