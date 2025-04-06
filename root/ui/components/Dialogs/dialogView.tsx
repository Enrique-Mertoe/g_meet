"use client"
import React, {useEffect, useState} from "react";


export interface DialogEventListener {
    onDismissed: (callback: () => void) => void
    feedbackHandler: (handler?: (...ags: unknown[]) => void) => void
}

export interface ModalEventListener {
    onDismiss: (callback: () => void) => void
}

export interface DHook {
    dismissAction?: (action: () => void) => void;
    onOpen?: () => void;
    onClose?: () => void;
}

const DialogView: React.FC<{
    hook?: DHook;
    design?: string;
    children?: React.ReactNode
// eslint-disable-next-line react/display-name
}> = React.memo(({
                     hook,
                     design,
                     children
                 }) => {
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, 0);
        hook?.dismissAction?.(() => {
            setVisible(false);
        });
        return () => clearTimeout(timer);
    }, [open]);

    return (
        <>
            <div className={`modal fade ${
                visible ? "show" : "!opacity-0"
            }`}>
                <div className="dialog-dialog dialog-dialog-centered">
                    <div className={`dialog-content rounded-sm ${design}`}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
});

export {
    DialogView
}