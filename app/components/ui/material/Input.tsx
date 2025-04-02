import React from "react";

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({className, ...props}) => {
    return (
        <>
            <input
                type="text"
                className={`block w-full px-4 py-2 text-gray-900 text-base font-normal 
                leading-6 appearance-none bg-white border border-gray-300 
                outline-0
                rounded-md transition duration-150 ease-in-out
                 focus:border-blue-500 focus:ring focus:ring-blue-200 ${className}`}
                {...props}
            />

        </>
    )
}

export {TextInput};