// import React, {useCallback, useEffect, useState} from "react";
// import {createRoot, Root} from "react-dom/client";
// import {DHook, DialogEventListener, DialogView, ModalEventListener} from "@/root/ui/components/Dialogs/dialogView";
// import {DialogProvider} from "@/root/ui/components/Dialogs/DialogContext";
// import {DialogBuilder} from "@/root/GTypes";
//
// export type ModalProp = {
//     show: () => void;
//     dismiss: () => void;
//     setContent: (content: React.ReactNode) => ModalProp
// }
//
// interface AlertProps {
//     content: React.ReactNode;
//     hooks: DialogBuilder;
// }
//
// const ModalComponent: React.FC<AlertProps> = ({content, hooks}) => {
//     const [open, setOpen] = useState(false);
//
//     const [view, setView] = useState<React.ReactNode | null>(null)
//
//
//     const [dismiss, setDismiss] = useState<() => void>(() => {
//     });
//
//
//     const dismissAlert = () => {
//         setTimeout(() => {
//             dismiss();
//         }, 300);
//     };
//
//     const processHandler = (defLabel: string, ...args: (string | Function)[]): [string, () => void] => {
//         const defaultCallback: () => void = () => {
//         };
//
//         // The first argument is the label, and the second is the callback if provided
//         const label = typeof args[0] === 'string' ? args[0] : defLabel;
//         const callback = typeof args[1] === 'function' ? args[1] as () => void : defaultCallback;
//
//         return [label, callback];
//     };
//
//     // useEffect(() => {
//     //     callback?.({
//     //         onDismissed(action) {
//     //             setDismiss(() => action);
//     //         },
//     //         feedbackHandler(fb) {
//     //             // fb?.(type == "confirm" ? confirmFB : {})
//     //         }
//     //     })
//     // }, [callback]);
//
//
//     const listener: DHook = {
//         dismissAction(action: () => void) {
//             // setDAction(() => action);
//         }
//     }
//
//
//     return (
//         <DialogView hook={listener} design={""}>
//             {content}
//         </DialogView>
//     );
// };
// const ModalProvider = (): ModalProp => {
//     let container: HTMLDivElement | null = null;
//     let root: any = null;
//     let view: React.ReactNode | null = null
//
//     const hooks: DialogBuilder = {
//         onDismiss: () => {
//         },
//         onOpen: () => {
//         },
//         show() {
//         },
//         dismiss() {
//         },
//         setView() {
//         }
//     }
//     const show = () => {
//         if (!container) {
//             container = document.createElement("div");
//             document.body.appendChild(container);
//             root = createRoot(container);
//         }
//         // root.render(<ModalComponent content={view} callback={event => {
//         //     event.onDismissed(() => {
//         //         if (container) {
//         //             container.remove();
//         //             container = null;
//         //         }
//         //     })
//         //     // event.feedbackHandler(callback)
//         // }}/>);
//         root.render(
//             <DialogProvider>
//                 <ModalComponent content={view} hooks={hooks}/>
//             </DialogProvider>
//         )
//     }
//     const dismiss = () => {
//         if (container) {
//             container.remove();
//             container = null;
//         }
//     }
//     const setContent = (content: React.ReactNode) => {
//         view = content
//         return self
//     }
//     const self = {show, setContent, dismiss}
//     return self
// }
// const Modal = (comp: React.ReactNode) => {
//     return ModalProvider().setContent(comp);
// };
// type ModalBuilder = {
//     from: (component: React.ReactNode) => ModalProp
// }
// const useModal = (): ModalBuilder => {
//     return {
//         from(component: React.ReactNode) {
//             return Modal(component)
//         }
//     }
// }
// export default useModal