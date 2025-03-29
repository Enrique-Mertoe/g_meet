import { useEffect, useState } from "react";
import io from "socket.io-client";
import mediasoupClient from "mediasoup-client";

const ScreenShare = () => {
    const [socket, setSocket] = useState(null);
    const [screenStream, setScreenStream] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        newSocket.on("routerRtpCapabilities", (capabilities) => {
            console.log("Mediasoup Capabilities:", capabilities);
        });
        setSocket(newSocket);
    }, []);

    const startScreenShare = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        console.log("Sharing Screen...");
    };

    const stopScreenShare = () => {
        screenStream?.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
        console.log("Stopped Sharing.");
    };

    return (
        <div>
            <button onClick={startScreenShare}>Start Screen Share</button>
            <button onClick={stopScreenShare} disabled={!screenStream}>Stop Screen Share</button>
        </div>
    );
};

export default ScreenShare;
