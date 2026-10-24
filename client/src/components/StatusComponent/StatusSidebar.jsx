import React, { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Text as TextIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    BarChart3,
    X,
    Trash2,
    Sparkles,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    createImageStatus,
    createPollStatus,
    createTextStatus,
    deleteStatus,
    fetchStatuses,
} from "../../store/status/statusAction";

const GRADIENT_PRESETS = [
    { label: "Purple Dream", value: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" },
    { label: "Ocean Blue", value: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)" },
    { label: "Emerald Glow", value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
    { label: "Sunset Flare", value: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)" },
    { label: "Midnight", value: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" },
];

const StatusCreateModal = ({ onClose }) => {
    const [mode, setMode] = useState(null); // "text" | "image" | "video" | "poll"
    const [bgGradient, setBgGradient] = useState(GRADIENT_PRESETS[0].value);
    const [textStatus, setTextStatus] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollQuestion, setPollQuestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const handleFileChange = (e, fileType) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const handlePollOptionChange = (index, value) => {
        const updated = [...pollOptions];
        updated[index] = value;
        setPollOptions(updated);
    };

    const handleAddPollOption = () => {
        setPollOptions([...pollOptions, ""]);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (mode === "text") {
                if (!textStatus.trim()) return;
                await dispatch(
                    createTextStatus({
                        type: "text",
                        text: textStatus.trim(),
                        background: bgGradient,
                    })
                ).unwrap();
            } else if (mode === "image" || mode === "video") {
                if (!mediaFile) return;
                const formData = new FormData();
                formData.append("type", mode);
                formData.append("image", mediaFile);
                if (caption.trim()) formData.append("caption", caption.trim());

                await dispatch(createImageStatus(formData)).unwrap();
            } else if (mode === "poll") {
                if (!pollQuestion.trim()) return;
                await dispatch(
                    createPollStatus({
                        type: "poll",
                        question: pollQuestion.trim(),
                        options: pollOptions.filter((opt) => opt.trim() !== ""),
                    })
                ).unwrap();
            }
            dispatch(fetchStatuses());
            onClose();
        } catch (err) {
            console.error("Failed to create status:", err);
            alert(typeof err === "string" ? err : "Failed to post status. Please check your network and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-slate-800 dark:text-slate-100 transition-colors">
                <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {!mode ? (
                    <div className="flex flex-col gap-4">
                        <div className="text-center mb-2">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Status</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Share an update with your friends for 24 hours
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setMode("text")}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-[#00A1FF]/10 dark:hover:bg-[#00A1FF]/20 border border-slate-200 dark:border-slate-700/80 hover:border-[#00A1FF]/50 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#00A1FF]/10 flex items-center justify-center text-[#00A1FF] group-hover:scale-110 transition-transform">
                                    <TextIcon size={20} />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Text Story</span>
                            </button>

                            <button
                                onClick={() => setMode("image")}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-[#00A1FF]/10 dark:hover:bg-[#00A1FF]/20 border border-slate-200 dark:border-slate-700/80 hover:border-[#00A1FF]/50 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#00A1FF]/10 flex items-center justify-center text-[#00A1FF] group-hover:scale-110 transition-transform">
                                    <ImageIcon size={20} />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Photo Story</span>
                            </button>

                            <button
                                onClick={() => setMode("video")}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-[#00A1FF]/10 dark:hover:bg-[#00A1FF]/20 border border-slate-200 dark:border-slate-700/80 hover:border-[#00A1FF]/50 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#00A1FF]/10 flex items-center justify-center text-[#00A1FF] group-hover:scale-110 transition-transform">
                                    <VideoIcon size={20} />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Video Story</span>
                            </button>

                            <button
                                onClick={() => setMode("poll")}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-[#00A1FF]/10 dark:hover:bg-[#00A1FF]/20 border border-slate-200 dark:border-slate-700/80 hover:border-[#00A1FF]/50 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#00A1FF]/10 flex items-center justify-center text-[#00A1FF] group-hover:scale-110 transition-transform">
                                    <BarChart3 size={20} />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Poll Story</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h2 className="text-base font-bold capitalize text-slate-900 dark:text-white">
                                {mode} Status
                            </h2>
                            <button
                                onClick={() => {
                                    setMode(null);
                                    setMediaFile(null);
                                    setMediaPreview(null);
                                }}
                                className="text-xs text-slate-500 hover:text-[#00A1FF] dark:text-slate-400 dark:hover:text-[#00A1FF] cursor-pointer transition-colors"
                            >
                                Change format
                            </button>
                        </div>

                        {/* Text Status Mode */}
                        {mode === "text" && (
                            <>
                                <textarea
                                    rows={3}
                                    placeholder="Type what's on your mind..."
                                    value={textStatus}
                                    onChange={(e) => setTextStatus(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF] resize-none"
                                />

                                {/* Color Gradient Presets */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                                        Choose Background:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {GRADIENT_PRESETS.map((preset, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setBgGradient(preset.value)}
                                                className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                                                    bgGradient === preset.value ? "scale-125 ring-2 ring-[#00A1FF]" : "hover:scale-110"
                                                }`}
                                                style={{ background: preset.value }}
                                                title={preset.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Live Preview Card */}
                                <div
                                    className="w-full h-44 flex items-center justify-center text-white text-base font-bold text-center p-4 rounded-xl shadow-inner select-none transition-all duration-300 overflow-hidden"
                                    style={{ background: bgGradient }}
                                >
                                    {textStatus || "Preview your status update"}
                                </div>
                            </>
                        )}

                        {/* Image Status Mode */}
                        {mode === "image" && (
                            <>
                                <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00A1FF] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "image")}
                                        className="hidden"
                                    />
                                    {mediaPreview ? (
                                        <img
                                            src={mediaPreview}
                                            alt="Preview"
                                            className="w-full h-44 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="py-6 flex flex-col items-center">
                                            <ImageIcon size={32} className="text-slate-400 mb-2" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                Click to select photo
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                                PNG, JPG, WEBP up to 25MB
                                            </span>
                                        </div>
                                    )}
                                </label>

                                <input
                                    type="text"
                                    placeholder="Add a caption (optional)"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF]"
                                />
                            </>
                        )}

                        {/* Video Status Mode */}
                        {mode === "video" && (
                            <>
                                <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#00A1FF] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-950/40">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, "video")}
                                        className="hidden"
                                    />
                                    {mediaPreview ? (
                                        <video
                                            src={mediaPreview}
                                            controls
                                            className="w-full h-44 object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="py-6 flex flex-col items-center">
                                            <VideoIcon size={32} className="text-[#00A1FF] mb-2" />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                Click to select video
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                                MP4, MOV, WEBM up to 50MB
                                            </span>
                                        </div>
                                    )}
                                </label>

                                <input
                                    type="text"
                                    placeholder="Add a caption (optional)"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF]"
                                />
                            </>
                        )}

                        {/* Poll Status Mode */}
                        {mode === "poll" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter poll question..."
                                    value={pollQuestion}
                                    onChange={(e) => setPollQuestion(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF] mb-2"
                                />
                                {pollOptions.map((opt, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF] mb-2"
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddPollOption}
                                    className="text-xs text-[#00A1FF] hover:text-[#008fe6] hover:underline cursor-pointer"
                                >
                                    + Add another option
                                </button>
                            </>
                        )}

                        {/* Modal Action Controls */}
                        <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00A1FF] hover:bg-[#008fe6] text-white shadow-lg shadow-[#00A1FF]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? "Posting..." : "Share Status"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { statuses, success, loading } = useSelector((state) => state.status);
    const currentUser = useSelector((state) => state.auth.user);

    const [searchTerm, setSearchTerm] = useState("");
    const [showOptionsId, setShowOptionsId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(fetchStatuses());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            dispatch(fetchStatuses());
        }
    }, [success, dispatch]);

    const handleDelete = (id) => {
        const isMine = myStatuses.some((s) => String(s._id) === String(id));
        if (!isMine) {
            alert("You can only delete your own status.");
            return;
        }

        if (window.confirm("Are you sure you want to delete your status update?")) {
            dispatch(deleteStatus(id));
            setShowOptionsId(null);
        }
    };

    const myStatuses = statuses?.filter(
        (s) => String(s?.user?._id) === String(currentUser?._id)
    );
    const friendsStatuses = statuses?.filter(
        (s) =>
            String(s?.user?._id) !== String(currentUser?._id) &&
            (!searchTerm || s?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <aside className="w-full md:w-80 lg:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-full text-slate-800 dark:text-slate-100 font-sans z-10 transition-colors duration-200">
            {/* Top Bar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Status & Stories</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#00A1FF]/20 active:scale-95 transition-all cursor-pointer"
                    >
                        <Plus size={15} />
                        <span>Add Status</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search friend updates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#00A1FF] transition-colors"
                    />
                </div>
            </div>

            {/* Stories Scroll List */}
            <div className="flex-1 overflow-y-auto customScrollbar divide-y divide-slate-200/60 dark:divide-slate-800/40">
                {/* My Status Card */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/30">
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-2">
                        My Update
                    </p>

                    {myStatuses && myStatuses.length > 0 ? (
                        <div className="flex items-center justify-between">
                            <NavLink
                                to={`/status/${myStatuses[0]._id}`}
                                className="flex items-center gap-3 min-w-0 flex-1 group"
                            >
                                <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#00A1FF] via-cyan-400 to-blue-600 shrink-0">
                                    <img
                                        src={currentUser?.profilePicture || currentUser?.profile_pic?.url || "/icon.png"}
                                        alt="My status"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-900"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#00A1FF] truncate">
                                        My Status
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(myStatuses[0].createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </NavLink>
                            <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(myStatuses[0]._id);
                                    }}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 text-slate-400 hover:text-rose-500 flex items-center justify-center cursor-pointer transition-colors"
                                    title="Delete my status"
                                >
                                    <Trash2 size={15} />
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#00A1FF]/15 flex items-center justify-center text-[#00A1FF] cursor-pointer transition-colors"
                                    title="Add another update"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={currentUser?.profilePicture || currentUser?.profile_pic?.url || "/icon.png"}
                                    alt="My profile"
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                />
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#00A1FF] text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-slate-900">
                                    +
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#00A1FF]">
                                    Create a status
                                </h4>
                                <p className="text-xs text-slate-500">Tap to share an update</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Updates Header */}
                <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-950/60 sticky top-0 z-10">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                        Recent Updates
                    </p>
                </div>

                {/* Friend Statuses */}
                <div className="divide-y divide-slate-200/60 dark:divide-slate-800/30">
                    {loading ? (
                        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                            Loading updates...
                        </div>
                    ) : friendsStatuses?.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 px-6">
                            No recent updates from friends.
                        </div>
                    ) : (
                        friendsStatuses.map((el) => {
                            const isActive = location.pathname === `/status/${el._id}`;
                            const isMenuOpen = showOptionsId === el._id;

                            return (
                                <div key={el._id} className="relative">
                                    <NavLink
                                        to={`/status/${el._id}`}
                                        className={`w-full flex items-center px-4 py-3.5 transition-all duration-200 border-l-4 group ${
                                            isActive
                                                ? "bg-[#00A1FF]/10 dark:bg-[#00A1FF]/15 border-[#00A1FF]"
                                                : "border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/40"
                                        }`}
                                    >
                                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#00A1FF] via-cyan-400 to-blue-600 shrink-0">
                                            <img
                                                src={el.user?.profile_pic?.url || "/icon.png"}
                                                alt={el.user?.name}
                                                className="h-11 w-11 rounded-full object-cover border-2 border-white dark:border-slate-900"
                                            />
                                        </div>

                                        <div className="ml-3 flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#00A1FF] truncate">
                                                {el.user?.name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(el.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </NavLink>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <StatusCreateModal onClose={() => setShowCreateModal(false)} />
            )}
        </aside>
    );
};

export default StatusSidebar;
