import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewStatus, deleteStatus, fetchStatuses } from "../../store/status/statusAction";
import { Send, Eye, Pause, Play, X, User, Trash2 } from "lucide-react";
import { sendMessage } from "../../store/chat/chatSlice";

const StatusPopup = ({ autoCloseAfter = 6 }) => {
    const { statusId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const { currentStatus: status, loading } = useSelector((state) => state.status);

    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showViewers, setShowViewers] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);

    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const pausedAtRef = useRef(0);
    const videoRef = useRef(null);

    // Fetch and track view on status mount
    useEffect(() => {
        if (statusId) {
            dispatch(viewStatus(statusId));
        }
    }, [statusId, dispatch]);

    // Progress bar animation loop
    useEffect(() => {
        if (!status || isPaused || showViewers) return;

        let durationMs = autoCloseAfter * 1000;
        if (status.type === "video" && videoRef.current?.duration) {
            durationMs = videoRef.current.duration * 1000;
        }

        const startTimestamp = performance.now() - pausedAtRef.current;
        startTimeRef.current = startTimestamp;

        const tick = (now) => {
            const elapsed = now - startTimestamp;
            const pct = Math.min((elapsed / durationMs) * 100, 100);
            setProgress(pct);

            if (pct >= 100) {
                navigate("/status");
            } else {
                animationRef.current = requestAnimationFrame(tick);
            }
        };

        animationRef.current = requestAnimationFrame(tick);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [status, isPaused, showViewers, autoCloseAfter, navigate]);

    const handlePause = () => {
        setIsPaused(true);
        if (startTimeRef.current) {
            pausedAtRef.current = performance.now() - startTimeRef.current;
        }
        if (videoRef.current) videoRef.current.pause();
    };

    const handleResume = () => {
        setIsPaused(false);
        if (videoRef.current) videoRef.current.play();
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !status?.user?._id) return;
        setIsSendingReply(true);

        try {
            const payload = {
                receiver: status.user._id,
                receiverId: status.user._id,
                receiverModel: "user",
                message: `Replied to status: "${replyText.trim()}"`,
            };

            await dispatch(sendMessage(payload)).unwrap();
            setReplyText("");
            alert("Reply sent successfully!");
        } catch (err) {
            console.error("Failed to send status reply:", err);
        } finally {
            setIsSendingReply(false);
            handleResume();
        }
    };

    if (loading || !status) {
        return (
            <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full border-2 border-[#00A1FF] border-t-transparent animate-spin mr-3" />
                Loading story...
            </div>
        );
    }

    const isMyStatus = String(status?.user?._id) === String(currentUser?._id);
    const mediaUrl =
        status?.media?.url ||
        status?.image?.url ||
        (typeof status?.image === "string" ? status.image : null);

    const renderMedia = () => {
        if (status.type === "video" || (mediaUrl && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm")))) {
            return (
                <video
                    ref={videoRef}
                    src={mediaUrl}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                />
            );
        }
        if (status.type === "image" || mediaUrl) {
            return (
                <img
                    src={mediaUrl}
                    alt="Status media"
                    className="w-full h-full object-cover"
                />
            );
        }
        if (status.type === "text") {
            return (
                <div
                    className="flex flex-col items-center justify-center w-full h-full p-8 text-white text-2xl sm:text-3xl font-bold text-center select-none"
                    style={{ background: status.background || "linear-gradient(135deg, #0ea5e9, #00A1FF)" }}
                >
                    <p className="max-w-lg leading-relaxed drop-shadow-md">
                        {status.text}
                    </p>
                </div>
            );
        }
        return null;
    };

    const handleDeleteStatus = async () => {
        if (!status?._id || !isMyStatus) return;
        handlePause();
        if (window.confirm("Are you sure you want to delete your status update?")) {
            try {
                await dispatch(deleteStatus(status._id)).unwrap();
                dispatch(fetchStatuses());
                navigate("/status");
            } catch (err) {
                console.error("Failed to delete status:", err);
                alert(typeof err === "string" ? err : "Failed to delete status");
                handleResume();
            }
        } else {
            handleResume();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
        >
            <div className="relative w-full max-w-lg h-full max-h-[92vh] sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
                {/* Media Container */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    {renderMedia()}
                </div>

                {/* Top Overlay Header */}
                <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                    {/* Animated Progress Bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-[#00A1FF] transition-all duration-75"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        {/* User Profile Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 bg-slate-800">
                                {status.user?.profile_pic?.url ? (
                                    <img
                                        src={status.user.profile_pic.url}
                                        alt={status.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-full h-full p-2 text-white" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-white drop-shadow">
                                    {status.user?.name || "User"}
                                </h3>
                                <p className="text-[11px] text-white/70">
                                    {new Date(status.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Top Controls: Delete (my status only), Pause/Play & Close */}
                        <div className="flex items-center gap-2">
                            {isMyStatus && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStatus();
                                    }}
                                    className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-100 cursor-pointer transition-colors"
                                    title="Delete my status"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isPaused ? handleResume() : handlePause();
                                }}
                                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white cursor-pointer"
                                title={isPaused ? "Resume" : "Pause"}
                            >
                                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/status");
                                }}
                                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white cursor-pointer"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Overlay Controls */}
                <div className="relative z-20 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2">
                    {/* Caption if provided */}
                    {status.caption && (
                        <p className="text-center text-sm font-medium text-white drop-shadow mb-1">
                            {status.caption}
                        </p>
                    )}

                    {isMyStatus ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePause();
                                setShowViewers(true);
                            }}
                            className="w-fit mx-auto px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
                        >
                            <Eye size={15} />
                            <span>{status?.views?.length || 0} Views</span>
                        </button>
                    ) : (
                        <div
                            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="text"
                                placeholder="Reply to this story..."
                                value={replyText}
                                onFocus={handlePause}
                                onBlur={handleResume}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-400 outline-none"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={!replyText.trim() || isSendingReply}
                                className="p-1.5 rounded-xl bg-[#00A1FF] text-white hover:bg-[#008fe6] disabled:opacity-40 cursor-pointer transition-colors shadow-md shadow-[#00A1FF]/20"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Viewers Bottom Drawer */}
                {showViewers && (
                    <div
                        className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowViewers(false);
                            handleResume();
                        }}
                    >
                        <div
                            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 max-h-[60%] flex flex-col text-slate-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Eye size={16} className="text-[#00A1FF]" />
                                    <span>Story Viewers ({status?.views?.length || 0})</span>
                                </h4>
                                <button
                                    onClick={() => {
                                        setShowViewers(false);
                                        handleResume();
                                    }}
                                    className="text-slate-400 hover:text-white p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-slate-800 customScrollbar">
                                {status?.views?.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-6">
                                        No viewers yet. Check back soon!
                                    </p>
                                ) : (
                                    status?.views?.map((viewer, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={viewer?.user?.profile_pic?.url || "/icon.png"}
                                                    alt="viewer"
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                                />
                                                <span className="text-xs font-semibold text-slate-200">
                                                    {viewer?.user?.name || "Anonymous Friend"}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(viewer?.viewedAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusPopup;
