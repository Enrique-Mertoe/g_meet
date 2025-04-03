import React, {useEffect, useState} from "react";

const TimeDisplay = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            setTime(`${hours}:${minutes.toString().padStart(2, "0")} ${seconds.toString().padStart(2, "0")} ${ampm}`);
        };

        updateTime(); // Set initial time
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="hstack transition-all duration-300 gap-3">
            <span>{time}</span>
            <span>|</span>
            <span>Meeting ID</span>
        </div>
    );
};
export default TimeDisplay;