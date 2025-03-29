import React from "react";
import Card from "@/app/components/widgets/Card";
import Image from "next/image";
import {Mic, MicOff} from "lucide-react";
import {PresentationInfo, UserInfo} from "@/app/fn";

interface GCardProps {
    type?: "user" | "presentation";
    info: UserInfo | PresentationInfo;
    gradient?: boolean;
}

const GCard: React.FC<GCardProps> = ({gradient, type, info, ...rest}) => {
    return (
        <>
            <div className={`w-auto aspect-square`}>
                <Card
                    className={`aspect-square h-100 ${gradient ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "bg-white"}`}>
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
                <div className="relative isolate flex items-center justify-center">
                    {/* Ping Effect */}
                    {info.isSpeaking && (
                        <div
                            className="absolute z-[-1] w-[70%] h-[70%] rounded-full bg-blue-500 animate-ping opacity-75"></div>
                    )}

                    {/* Avatar */}
                    <Image
                        src={info.avatar}
                        alt={info.name}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-white"
                    />
                </div>


                {/* Username */}
                <h2 className="mt-3 text-lg font-black text-gray-800">{info.name}</h2>

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