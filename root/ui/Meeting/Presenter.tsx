"use client";
import React, { useEffect } from "react";
import useWebSocket from "@/root/hooks/useWebSocket";

const Presenter: React.FC = () => {
  const { sendMessage } = useWebSocket("ws://localhost:3500");

  const handleScroll = () => {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    sendMessage({ event: "scroll", scroll_percent: scrollPercent });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const xPercent = (e.clientX / window.innerWidth) * 100;
    const yPercent = (e.clientY / window.innerHeight) * 100;
    sendMessage({ event: "cursor_move", x_percent: xPercent, y_percent: yPercent });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div className="h-screen w-full overflow-auto bg-gray-100">Presenting...</div>;
};

export default Presenter;
