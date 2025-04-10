import type {Metadata} from "next";
import React from "react";
import {Geist, Geist_Mono} from "next/font/google";

export const metadata: Metadata = {
    title: "Meet app",
    description: "Generated by create next app",
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
        <html lang="en">
        <head>
            <link rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} bg-dark2 antialiased`}
        >
        {children}
        </body>
        </html>
    );
}