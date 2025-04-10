import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../root/styles/globals.css";
import "../root/styles/widgets.scss"
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Your Virtual Classroom, Reinvented\n" +
        "for the Modern Academic World",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} bg-dark2 antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
