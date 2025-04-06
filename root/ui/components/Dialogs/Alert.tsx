"use client";
import React, {useCallback, useEffect, useState} from "react";
import {AlertCircle, Info, CheckCircle, AlertTriangle} from "lucide-react";
import {DHook, DialogEventListener, DialogView} from "@/root/ui/components/Dialogs/dialogView";
import {createRoot} from "react-dom/client";
import GIcon from "@/root/ui/components/Icons";
import {Button} from "@/root/ui/components/material-design/button";
import {Closure} from "@/root/GTypes";

const icons = {
    error: <AlertCircle className="text-red-500 w-6 h-6"/>,
    warn: <AlertTriangle className="text-yellow-500 w-6 h-6"/>,
    info: <Info className="text-blue-500 w-6 h-6"/>,
    success: <CheckCircle className="text-green-500 w-6 h-6"/>,
};


interface AlertProps {
    type: AlertOptions["type"];
    message: string;
    callback?: (event: DialogEventListener) => void;
}

interface AlertOptions {
    type: "error" | "warn" | "info" | "success" | "confirm";
    message: string;
    callback?: () => void;
}

interface CHandlerProps {
    label: string;
    action: Closure
}

export interface ConfirmHandler {
    positiveFeedback(...args: (string | Closure)[]): void

    negativeFeedback(...args: (string | Closure)[]): void
}

const AlertComponent: React.FC<AlertProps> = ({type, message, callback}) => {
    const [open, setOpen] = useState(false);

    const icons: Record<string, unknown> = {
        error: {
            icon: "alert-triangle",
            text: "text-red-600",
            btn: "danger-soft",
        },
        warn: {
            icon: "alert-circle",
            text: "text-yellow-600",
            btn: "warning-soft",
        },
        info: {
            icon: "info",
            text: "text-blue-600",
            btn: "info-soft",
        },
        success: {
            icon: "check-circle",
            text: "text-green-600",
            btn: "success-soft",
        },
        confirm: {
            icon: "help-circle",
            text: "text-blue-600",
            btn: "outline-info",
        },
    };

    const [dAction, setDAction] = useState<() => void>(() => {
    });
    const [dismiss, setDismiss] = useState<() => void>(() => {
    });
    const [btnOk, setOk] = useState(
        {
            label: "Ok", hnd: () => {
            }
        }
    );

    const [btnCancel, setCancel] = useState(
        {
            label: "Cancel", hnd: () => {
            }
        }
    );
    const [state, setState] = useState({
        type: "info", message: "", callback: null
    });


    const dismissAlert = useCallback(() => {
        dAction();
        setTimeout(() => {
            dismiss();
        }, 300);
    }, [dAction, dismiss]);

    const processHandler = (defLabel: string, ...args: (string | Closure)[]): [string, () => void] => {
        const defaultCallback: () => void = () => {
        };

        // The first argument is the label, and the second is the callback if provided
        const label = typeof args[0] === 'string' ? args[0] : defLabel;
        const callback = typeof args[1] === 'function' ? args[1] as () => void : defaultCallback;

        return [label, callback];
    };
    const confirmFB: ConfirmHandler = {
        positiveFeedback(...args) {
            const [leb, cb] = processHandler("Ok", ...args);
            setOk(() => ({label: leb, hnd: cb}))
        }
        , negativeFeedback(...args) {
            const [leb, cb] = processHandler("Cancel", ...args);
            setCancel(() => ({label: leb, hnd: cb}))
        }
    }

    useEffect(() => {
        callback?.({
            onDismissed(action) {
                setDismiss(() => action);
            },
            feedbackHandler(fb) {
                fb?.(type == "confirm" ? confirmFB : {})
            }
        })
    }, [callback]);


    const listener: DHook = {
        dismissAction(action: () => void) {
            setDAction(() => action);
        }
    }

    const handleFeedback = (choice: "ok" | "no") => {
        choice == "ok" ? btnOk.hnd() : btnCancel.hnd();
    }
    return (
        <DialogView hook={listener} design={"p-3"}>
            <div className="hstack mb-2">
                <GIcon color={icons[type].text} name={icons[type].icon} size={34}/>
            </div>
            <p className={"font-bold text-center"}>{message}</p>
            <div className="hstack mt-3">
                {
                    type == "confirm" && <Button
                        text={btnCancel.label}
                        design={"outline-danger"}
                        className={"ms-auto"}
                        onClick={ev => {
                            handleFeedback("no")
                            dismissAlert()
                        }}
                    />
                }
                <Button
                    text={btnOk.label}
                    design={icons[type].btn}
                    className={type == "confirm" ? "ms-2" : "ms-auto"}
                    onClick={e => {
                        handleFeedback("ok")
                        dismissAlert()
                    }}
                />
            </div>
        </DialogView>
    );
};


class AlertDialog {
    private container: HTMLDivElement | null = null;
    private root: any = null;

    constructor(type: AlertOptions["type"], message: string, callback?: () => void) {
        this.show(type, message, callback)
    }

    private show(type: AlertOptions["type"], message: string, callback?: (...args: any) => void) {
        if (!this.container) {
            this.container = document.createElement("div");
            document.body.appendChild(this.container);
            this.root = createRoot(this.container);
        }
        this.root.render(<AlertComponent type={type} message={message} callback={event => {
            event.onDismissed(() => {
                if (this.container) {
                    this.container.remove();
                    this.container = null;
                }
            })
            event.feedbackHandler(callback)
        }}/>);
    }

    static create(type: AlertOptions["type"], message: string, callback?: (...args: any) => void): AlertDialog {
        return new this(type, message, callback);
    }
}

const Alert = (() => {
    const create = (type: AlertOptions["type"], message: string, callback?: (...args: any) => void) => {
        return AlertDialog.create(type, message, callback)
    };

    return {
        error: (message: any, callback?: any) => create("error", message, callback),
        warn: (message: any, callback?: any) => create("warn", message, callback),
        info: (message: any, callback?: any) => create("info", message, callback),
        success: (message: any, callback?: any) => create("success", message, callback),
        confirm: (message: any, feedbackHandler?: (handler: ConfirmHandler) => void) => create("confirm", message, feedbackHandler)
    };
})();

export default Alert;
