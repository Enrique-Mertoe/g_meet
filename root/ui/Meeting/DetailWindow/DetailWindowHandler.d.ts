import React from "react";

declare interface DetailWindowHandler {
    title: string,
    view: React.FC,
    key: string
}

declare interface DetailScreenHandler {
    mode: "off" | "on",
    data:DetailWindowHandler
}