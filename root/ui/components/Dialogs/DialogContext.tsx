// import React, {createContext, useContext, useEffect, useRef, useState} from "react";
// import {DialogBuilder} from "@/root/GTypes";
// import {createRoot} from "react-dom/client";
//
// type SocketContextType = {
//     builder: DialogBuilder | null;
// };
//
// export interface DHook {
//     dismissAction?: (action: () => void) => void;
//     onOpen?: () => void;
//     onClose?: () => void;
// }
//
// const DialogView: React.FC<{
//     hook?: DHook;
//     design?: string;
//     children?: React.ReactNode
// }> = React.memo(({
//                      hook,
//                      design,
//                      children
//                  }) => {
//     const [visible, setVisible] = useState(false);
//
//
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setVisible(true);
//         }, 0);
//         hook?.dismissAction?.(() => {
//             setVisible(false);
//         });
//         return () => clearTimeout(timer);
//     }, [open]);
//
//     return (
//         <>
//             <div className={`modal fade ${
//                 visible ? "show" : "!opacity-0"
//             }`}>
//                 <div className="dialog-dialog dialog-dialog-centered">
//                     <div className={`dialog-content rounded-sm ${design}`}>
//                         {children}
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// });
//
// const DialogContext = createContext<SocketContextType>({socket: null});
//
// export const DialogProvider = ({children}: { children: React.ReactNode }) => {
//     const builder = useRef<DialogBuilder | null>(null)
//     const container = useRef<HTMLDivElement>(document.createElement("div"))
//     useEffect(() => {
//         builder.current = {
//             show(): void {
//             },
//             dismiss(): DialogBuilder {
//                 return this;
//             }, onDismiss(): DialogBuilder {
//                 return this;
//             }, onOpen(): DialogBuilder {
//                 return this;
//             }, setView(view: React.ReactNode): DialogBuilder {
//                 return this;
//             }
//
//         }
//             document.body.appendChild(container.current);
//             // root = createRoot(container);
//
//     }, []);
//
//     return (
//         <DialogContext.Provider value={{builder: builder.current}}>
//             <DialogView>
//                 {children}
//             </DialogView>
//         </DialogContext.Provider>
//     );
// };
//
// export const useDialog = () => {
//     const context = useContext(DialogContext);
//     if (!context) {
//         throw new Error('useDialog must be used within a DialogProvider');
//     }
//     return context.builder
// };
