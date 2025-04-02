import React, {CSSProperties} from "react";
import Card from "@/app/ui/components/material-design/Card";
import Image from "next/image";
import {Mic, MicOff} from "lucide-react";
import {PresentationInfo, UserInfo} from "@/app/fn";

interface GCardProps {
    type?: "user" | "presentation";
    info: UserInfo | PresentationInfo;
    gradient?: boolean;
    className?: string;
    style?: CSSProperties
}

const GCard: React.FC<GCardProps> = ({
                                         gradient,
                                         type,
                                         info,
                                         className,
                                         style,
                                         ...rest
                                     }) => {
    return (
        <>
            <div className={`duration-300 ease-out h-full w-full transform transition-all ${className}`} style={style}>
                <Card
                    className={`h-full w-full bg-[#3c4043]`}>
                    {type === "user" ? (
                        <UserView info={info as UserInfo}/>
                    ) : (
                        <PresentationView info={info as PresentationInfo}/>
                    )}


                </Card>
            </div>
        </>
    );
};

const UserView: React.FC<{ info: UserInfo }> = ({info}) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                {/* Avatar with Ripple Effect if speaking */}
                <div className="relative h-[50%] aspect-square isolate flex items-center justify-center">
                    {/* Ping Effect */}
                    {info.isSpeaking && (
                        <div
                            className="absolute z-[-1] w-[60%] h-[60%] rounded-full bg-blue-600 animate-ping opacity-100"></div>
                    )}

                    {/* Avatar */}
                    <Image
                        src={info.avatar}
                        alt={info.name}
                        width={100}
                        height={100}
                        className="rounded-full w-full h-full aspect-square border-4 border-white"
                    />
                </div>


                {/* Username */}
                <h2 className="mt-3 text-lg font-black text-gray-100">{info.name}</h2>

                {/* Mic Status */}
                <div className="mt-2">
                    {info.micOn ? (
                        <Mic className="text-green-400"/>
                    ) : (
                        <MicOff className="text-red-400"/>
                    )}
                </div>
            </div>
        </>
    );
};

// ✅ Presentation Card Component
const PresentationView: React.FC<{ info: PresentationInfo }> = ({info}) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl">{info.title}</h2>
                <div className="mt-4 w-full h-full">{info.content}</div>
            </div>
        </>
    );
};

export default GCard;