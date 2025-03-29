import React from "react";

export interface UserInfo {
    name: string;
    avatar: string;
    isSpeaking?: boolean;
    micOn?: boolean;
}

export interface PresentationInfo {
    title: string;
    content: React.ReactNode;
}