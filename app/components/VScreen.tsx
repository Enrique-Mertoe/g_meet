import {ReactNode} from "react";

interface VScreenProps {
    children?: ReactNode;
}

export default function VScreen({
                                    children
                                }: VScreenProps) {
    return (
        <>
            <div className="grow w-100">
                <div className={"flex p-2 flex-wrap gap-1"}>
                    {children}
                </div>
            </div>
        </>
    )
}