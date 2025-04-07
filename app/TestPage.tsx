"use client"
import React, {useCallback, useEffect, useRef} from "react";
import {DialogProvider, useDialog} from "@/root/ui/components/Dialogs/DialogProvider";

import {useMyComponent, ViewProvider} from "@/tests/m";


const Page: React.FC = ({}) => {
    const dl = useDialog()
    const d = useCallback(() => {
        dl.create({
            content: (() => {
                const Vi = React.memo(function Mm(){
                    useEffect(() => {
                        alert(3);
                    }, []);
                    return <>mss</>;
                });
                return <Vi/>
            })()
        })
    }, [dl]);
    useEffect(() => {
        d()
    }, []);
    return (
        <>
        </>
    )
}

const P1 = function () {
    return (
        <DialogProvider>
            <Page/>
        </DialogProvider>
    )
}

function MyApp() {
    return (
        <ViewProvider>
            <App/>
        </ViewProvider>
    );
}

export const MyComponent: React.FC = () => {
    const {views} = useMyComponent();

    return (
        <div>
            <h1>My Component</h1>
            <div>
                {views.map((view, index) => (
                    <div key={index}>{view}</div>
                ))}
            </div>
        </div>
    );
};


const ViewToAdd = function () {
    // useRef to keep track of whether the effect has been triggered
    const hasEffectTriggered = useRef(false);

    useEffect(() => {
        if (hasEffectTriggered.current) return;  // Prevent effect if already triggered

        hasEffectTriggered.current = true; // Mark the effect as triggered
        alert(56); // Trigger alert or other side effects you need
    }, []); // Empty dependency array, runs only on mount

    return (<>
        <div>New view added at {new Date().toISOString()}</div>
    </>)
}
const App: React.FC = () => {
    const {addView} = useMyComponent();

    const handleAddView = () => {
        addView(<ViewToAdd/>);
    };

    return (
        <div>
            <h1>App Component</h1>
            <button onClick={handleAddView}>Add View</button>
            <MyComponent/>
        </div>
    );
};

export default MyApp
