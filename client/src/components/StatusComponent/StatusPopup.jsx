// src/components/status/StatusPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewStatus } from "../../store/status/statusAction";
import { IoSend } from "react-icons/io5";
import { EyeIcon } from "lucide-react";
import { CgPlayPauseO } from "react-icons/cg";
import { IoPlayCircleOutline } from "react-icons/io5";
const StatusPopup = ({ autoCloseAfter = 5 }) => {
    const { statusId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const myUser = JSON.parse(sessionStorage.getItem("myUser"));
    const { currentStatus: status, loading } = useSelector(
        (state) => state.status
    );

    const [progressWidth, setProgressWidth] = useState("0%");
    const [showViewers, setShowViewers] = useState(false);
    const [stopAutoClose, setStopAutoClose] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isTouching, setIsTouching] = useState(false);

    const timerRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        if (statusId) {
            dispatch(viewStatus(statusId));
        }
    }, [statusId, dispatch]);

    const startTimers = () => {
        if (stopAutoClose || isTyping || isTouching) return;

        progressRef.current = setTimeout(() => {
            setProgressWidth("100%");
        }, 100);

        timerRef.current = setTimeout(() => {
            navigate(-1);
        }, autoCloseAfter * 1000);
    };

    const clearTimers = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressRef.current) clearTimeout(progressRef.current);
    };

    useEffect(() => {
        clearTimers();
        startTimers();

        return () => {
            clearTimers();
        };
    }, [
        navigate,
        autoCloseAfter,
        stopAutoClose,
        isTyping,
        isTouching,
        statusId,
    ]);

    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);

    const handleInputChange = (e) => {
        setIsTyping(e.target.value.length > 0);
    };

    const handleStopAutoClose = () => {
        setStopAutoClose(true);
        clearTimers();
    };

    if (loading || !status) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <p className="text-white text-lg">Loading status...</p>
            </div>
        );
    }

    const renderMedia = () => {
        if (status.type === "image") {
            return (
                <img
                    src={status.image}
                    alt="status"
                    className="w-full h-full object-contain"
                />
            );
        } else if (status.type === "video") {
            return (
                <video
                    src={status.media.url}
                    autoPlay
                    muted
                    className="w-full h-full object-contain"
                />
            );
        } else if (status.type === "text") {
            return (
                <div
                    className={`flex items-center justify-center w-full h-full text-white text-3xl    `}
                    style={{ background: status.background }}
                >
                    {status.text}
                </div>
            );
        }
        return null;
    };
    console.log("status", status.background);
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-[30rem] h-screen bg-black text-white overflow-hidden">
                {/* Media content */}
                <div className="absolute inset-0">{renderMedia()}</div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {/* Header */}
                    <div>
                        {/* Progress bar */}
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-white"
                                style={{
                                    width: progressWidth,
                                    transition: `width ${autoCloseAfter}s linear`,
                                }}
                            ></div>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={status?.user?.profile_pic?.url}
                                    alt={status.user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">
                                        {status.user.name}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        {new Date(
                                            status.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!stopAutoClose ? (
                                    <button
                                        onClick={handleStopAutoClose}
                                        className="text-xs px-2 py-1 border border-gray-400 rounded hover:bg-white hover:text-black"
                                    >
                                        <CgPlayPauseO size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setStopAutoClose(false)}
                                        className="text-xs px-2 py-1 border border-gray-400 rounded hover:bg-white hover:text-black"
                                    >
                                        <IoPlayCircleOutline size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(-1)}
                                    className="text-2xl font-bold hover:text-red-400"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col gap-2">
                        {status.caption && (
                            <p className="text-center">{status.caption}</p>
                        )}

                        {status?.user?._id === myUser?._id ? (
                            <span
                                onClick={() => setShowViewers(true)}
                                className="text-center flex justify-center items-center gap-2 cursor-pointer text-gray-300"
                            >
                                {status?.totalViews} <EyeIcon size={16} />
                            </span>
                        ) : (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                                <input
                                    type="text"
                                    placeholder="Reply..."
                                    onChange={handleInputChange}
                                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-300"
                                />
                                <IoSend
                                    className="text-white cursor-pointer"
                                    size={22}
                                />
                            </div>
                        )}
                    </div>

                    {/* Viewers Modal */}
                    {showViewers && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="bg-white text-black p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-2">
                                    Viewers
                                </h2>
                                <ul>
                                    {status?.views?.map((viewer) => (
                                        <li
                                            key={viewer.user._id}
                                            className="flex items-center gap-2 mb-2"
                                        >
                                            <img
                                                src={
                                                    viewer.user.profile_pic.url
                                                }
                                                alt={viewer.user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span>{viewer.user.name}</span>
                                            <span>
                                                {new Date(
                                                    viewer.viewedAt
                                                ).toLocaleString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setShowViewers(false)}
                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default StatusPopup;
