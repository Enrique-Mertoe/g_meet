import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    design?: string;
}

const Button: React.FC<{
    text?: string;
    icon?: React.ReactNode;
    design?:
        "primary" |
        "light" |
        "white" |
        "secondary" |
        "success" |
        "info" |
        "warning" |
        "danger" |
        "dark" |
        "outline-primary" |
        "outline-white" | "outline-secondary" |
        "outline-success" |
        "outline-info" |
        "outline-warning" | "outline-danger" |
        "outline-light" |
        "outline-dark" |
        "link" |
        "primary-soft" | "white-soft" | "secondary-soft" |
        "success-soft" | "info-soft" | "warning-soft" |
        "danger-soft" | "light-soft" | "dark-soft";
    className?: string;

} & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({text, icon, design = "light", className, ...rest}) => {
    const buttonStyles = {
        primary: "bg-green-500 text-white border border-green-500 hover:bg-green-600 hover:border-green-600",
        light: "bg-gray-100 text-black border border-gray-100 hover:bg-gray-300 hover:border-gray-400",
        white: "bg-white text-black border border-white hover:bg-gray-200 hover:border-gray-300",
        secondary: "bg-gray-500 text-white border border-gray-500 hover:bg-gray-600 hover:border-gray-600",
        success: "bg-green-400 text-white border border-green-400 hover:bg-green-500 hover:border-green-500",
        info: "bg-teal-400 text-white border border-teal-400 hover:bg-teal-500 hover:border-teal-500",
        warning: "bg-yellow-400 text-black border border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500",
        danger: "bg-red-400 text-white border border-red-400 hover:bg-red-500 hover:border-red-500",
        dark: "bg-gray-800 text-white border border-gray-800 hover:bg-gray-900 hover:border-gray-900",

        //soft design
        // Soft button designs
        "primary-soft": "text-green-500 bg-green-100 hover:bg-green-500 hover:text-white",
        "light-soft": "text-gray-600 bg-gray-100 bg-opacity-10 hover:bg-gray-300 hover:text-black",
        "white-soft": "text-white bg-white bg-opacity-10 hover:bg-white hover:text-black",
        "secondary-soft": "text-gray-600 bg-gray-200 bg-opacity-10 hover:bg-gray-600 hover:text-white",
        "success-soft": "text-green-500 bg-green-100 bg-opacity-10 hover:bg-green-500 hover:text-white",
        "info-soft": "text-teal-500 bg-teal-100 bg-opacity-10 hover:bg-teal-500 hover:text-white",
        "warning-soft": "text-yellow-600 bg-yellow-100 bg-opacity-10 hover:bg-yellow-500 hover:text-black",
        "danger-soft": "text-red-600 bg-red-100 bg-opacity-10 hover:bg-red-500 hover:text-white",
        "dark-soft": "text-gray-800 bg-gray-900 bg-opacity-10 hover:bg-gray-900 hover:text-white",


        // outline design
        "outline-primary": "bg-transparent text-green-500 border border-green-500 hover:bg-green-500 hover:text-white hover:border-green-500",
        "outline-white": "bg-transparent text-white border border-white hover:bg-white hover:text-black hover:border-white",
        "outline-secondary": "bg-transparent text-gray-500 border border-gray-500 hover:bg-gray-500 hover:text-white hover:border-gray-500",
        "outline-success": "bg-transparent text-green-400 border border-green-400 hover:bg-green-400 hover:text-white hover:border-green-400",
        "outline-info": "bg-transparent text-teal-400 border border-teal-400 hover:bg-teal-400 hover:text-white hover:border-teal-400",
        "outline-warning": "bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400",
        "outline-danger": "bg-transparent text-red-400 border border-red-400 hover:bg-red-400 hover:text-white hover:border-red-400",
        "outline-light": "bg-transparent text-gray-100 border border-gray-100 hover:bg-gray-100 hover:text-black hover:border-gray-100",
        "outline-dark": "bg-transparent text-gray-800 border border-gray-800 hover:bg-gray-800 hover:text-white hover:border-gray-800",
        link: "bg-transparent text-blue-500 border border-transparent hover:bg-transparent hover:text-blue-700",
    };
    let Icon = () => {
        return <>{icon}</>
    }

    return (
        <button
            className={`px-4 py-[0.1rem] cursor-pointer rounded-sm font-semibold transition-all ${buttonStyles[design]} ${className}`}
            {...rest}
        >
            {
                icon && <Icon/>
            }
            {text && text}
        </button>
    );
};


export {
    Button
}