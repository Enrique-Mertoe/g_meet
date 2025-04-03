import {useState} from "react";

export default function ToggleSwitch({disabled = false}) {
    const [checked, setChecked] = useState(false);

    return (
        <label
            className={`relative select-none inline-block w-[45px] h-[24px] ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={() => !disabled && setChecked(!checked)}
                className="sr-only peer"
            />
            <span
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                    checked ? "bg-blue-500" : "bg-gray-200"
                }`}
            ></span>
            <span
                className={`absolute left-[2px] bottom-[2.2px] w-[20px] h-[20px] bg-white rounded-full transition-all duration-300 flex items-center justify-center text-sm ${
                    checked ? "translate-x-[22px] bg-blue-400" : "bg-blue-200"
                }`}
            >
        {checked ?
            <svg width={14} height={16} viewBox="0 0 24 24">
                <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z"></path>
            </svg>
            : <svg width={16} height={16} viewBox="0 0 24 24">
                <path
                    d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"></path>
            </svg>}
      </span>
        </label>
    );
}