import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusPopup from "../components/StatusComponent/StatusPopup";

const Status = () => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <section className="flex w-full ">
            <Sidebar />

            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <button
                    className="bg-green-500 px-4 py-2 rounded-md"
                    onClick={() => setShowPopup(true)}
                >
                    Show Status
                </button>

                {showPopup && (
                    <StatusPopup
                        onClose={() => setShowPopup(false)}
                        status={{
                            type: "video", // "image" | "video" | "text"
                            src: "https://youtube.com/shorts/AyQNVN59rRA?si=CohbXKM738aHPCMj", // Only for image/video
                            text: "Parindon ki tarah", // Only for text type
                            caption: "Parindon ki tarah",
                            bottomText: "Abb to aaja... 🥺😌🌧️",
                            timestamp: "Yesterday at 8:56 PM",
                            views: 18,
                        }}
                    />
                )}
            </div>
        </section>
    );
};
export default Status;
