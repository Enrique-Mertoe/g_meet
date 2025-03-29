import React from "react";

const GContainer: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <>
            <div className="h-[100vh] w-[100vw]">
                <div className="flex h-full w-full  flex-col gap-0">
                    {children}
                </div>
            </div>

        </>
    )
}

export default GContainer;