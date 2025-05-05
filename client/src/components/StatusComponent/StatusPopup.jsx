import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function StatusPopup({ onClose, status, autoCloseAfter = 5 }) {
    const navigate = useNavigate();
    const [progressWidth, setProgressWidth] = useState("0%");

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(-1);
        }, autoCloseAfter * 1000);

        const animationTrigger = setTimeout(() => {
            setProgressWidth("100%");
        }, 50);

        return () => {
            clearTimeout(timer);
            clearTimeout(animationTrigger);
        };
    }, [autoCloseAfter, navigate]);

    const renderMedia = () => {
        if (status.type === "image") {
            return (
                <img
                    src={status.src}
                    alt="status"
                    className="absolute inset-0 w-full h-full object-contain z-0 bg-black"
                />
            );
        }
        if (status.type === "video") {
            return (
                <video
                    src={status.src}
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-contain z-0 bg-black"
                />
            );
        }
        if (status.type === "text") {
            return (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold z-0">
                    {status.text}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full min-h-screen bg-black flex items-center justify-center px-4 relative">
            <div className="w-[30rem] h-screen relative overflow-hidden rounded-2xl shadow-2xl z-10">
                {/* Media background */}
                {renderMedia()}

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between z-10">
                    {/* Header */}
                    <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 pt-3 pb-1">
                        {/* Smooth linear progress bar */}
                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-white"
                                style={{
                                    width: progressWidth,
                                    transition: `width ${autoCloseAfter}s linear`,
                                }}
                            ></div>
                        </div>

                        {/* Avatar and close */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        status.avatar ||
                                        "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
                                    }
                                    alt="avatar"
                                    className="w-9 h-9 rounded-full object-cover"
                                />
                                <div className="text-white text-sm">
                                    <div className="font-semibold">
                                        {status.name || "User Name"}
                                    </div>
                                    <div className="text-gray-300 text-xs">
                                        {status.timestamp || "Just now"}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose || (() => navigate(-1))}
                                className="text-white text-2xl hover:text-red-400"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pt-4 pb-5 bg-white/10 backdrop-blur-md border-t border-white/20 text-white">
                        {status.caption && (
                            <p className="text-sm font-medium text-center mb-3">
                                {status.caption}
                            </p>
                        )}

                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl">
                            <input
                                type="text"
                                name="captionMsg"
                                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
                                placeholder="Type a reply..."
                            />
                            <IoSend className="text-xl text-white cursor-pointer hover:text-primary" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
