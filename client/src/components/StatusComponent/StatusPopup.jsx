import React from "react";

function StatusPopup({ onClose, status }) {
    const renderMedia = () => {
        switch (status.type) {
            case "image":
                return (
                    <img
                        src={status.src}
                        alt="status"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                );
            case "video":
                return (
                    <video
                        src={status.src}
                        autoPlay
                        loop
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                );
            case "text":
                return (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                        {status.text}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            {renderMedia()}
            {/* <div className="h-full w-[23.75rem] ">{renderMedia()}</div> */}
            {/* <div className="relative w-[380px] h-[680px] bg-black rounded-lg overflow-hidden">
                Close button
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white text-xl z-10"
                >
                    ✕
                </button>

                Top progress bar
                <div className="w-full h-1 bg-gray-300 mt-4 mx-auto rounded-lg overflow-hidden">
                    <div className="h-full bg-white w-3/4 animate-pulse">
                        211
                    </div>
                </div>

                Media
                <div className="absolute top-0 left-0 w-full h-full">
                    {renderMedia()}
                </div>

                Overlay content
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4">
                    Timestamp
                    <div className="relative text-white text-sm font-semibold">
                        {status.timestamp || "Just now"}
                    </div>

                    Caption
                    {status.caption && (
                        <div className="relative text-white text-xl text-center font-bold mt-auto mb-auto">
                            {status.caption}
                        </div>
                    )}

                    Bottom row
                    {status.bottomText && (
                        <div className="relative flex justify-between items-center text-white text-sm">
                            <span>{status.bottomText}</span>
                            <span className="flex items-center gap-1">
                                👁️ {status.views || 0}
                            </span>
                        </div>
                    )}
                </div>
            </div>  */}
        </div>
    );
}
export default StatusPopup;
