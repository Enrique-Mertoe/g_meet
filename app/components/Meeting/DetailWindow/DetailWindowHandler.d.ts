import React from "react";

declare interface DetailWindowHandler {
    title: string,
    view: React.ReactNode,
    key: string
}

declare interface DetailScreenHandler {
    mode: "off" | "on",
    data:DetailWindowHandler
}