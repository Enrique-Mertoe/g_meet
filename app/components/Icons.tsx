import {
    LucideIcon,
    MessageCircle,
    Mic,
    MicOff,
    MoreVertical,
    PhoneOff,
    ScreenShare,
    Smile,
    Users,
    Video,
    VideoOff, Phone, ChevronUp, Hand, Square, Pause, Play, AlertTriangle, CheckCircle, Info, AlertCircle, HelpCircle

} from "lucide-react";
import React from "react";

const ICONS: Record<string, LucideIcon> = {
    Mic,
    MicOff,
    Video,
    VideoOff,
    ScreenShare,
    Users,
    MessageCircle,
    Smile,
    MoreVertical,
    PhoneOff,
    AlertCircle, Info, CheckCircle, AlertTriangle,
    Phone,
    ChevronUp,HelpCircle,
    Hand,
    Square, Pause, Play,
};

interface IconProps {
    name: keyof typeof ICONS;  // Restrict to available icons
    size?: number;
    color?: string;
}

function toPascalCase(str: string): string {
    return str
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

const GIcon: React.FC<IconProps> = ({name, size = 24, color = "text-white"}) => {
    name = toPascalCase(name);
    const IconComponent = ICONS[name]; // Get the icon component

    if (!IconComponent) return null;

    return <IconComponent size={size}
                          className={color}
    />;
};

export default GIcon;