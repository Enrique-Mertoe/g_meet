import React from "react";

declare interface COptions {
    view: React.FC<ControlItemOptionsAction>;
    handler: (ref: string, event: CEvent) => void,

}


declare interface ControlItemProps<T = any> {
    icon: string;
    isActive?: boolean;
    colors?: string;
    extra?: React.ReactNode;
    onAction?: (event: CEvent<T>) => void;
    className?: string;
    onToggle?: (event: CEvent<T>) => void;
    design?: string;
    tooltip?: string;
    options?: COptions
}

declare interface ControlParams {
    mute?: boolean;
}

declare interface CEvent<T = any> {
    preventDefault: () => void;
    data: () => T;
    active: (state?: boolean) => void | boolean;
    icon: (name: string) => void;
}

declare interface ControlItemOptionsAction {
    onClick: (ref: string) => void
}
