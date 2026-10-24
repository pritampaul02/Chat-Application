import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    sendFriendRequest,
    cancelFriendRequest,
    manageFriendRequest,
} from "../../store/friends/friendsAction";
import { resetFriendState } from "../../store/friends/friendsSlice";
import { getMe } from "../../store/auth/authActions";
import { fetchUserById } from "../../store/userProfile/userProfileAction";
import {
    ArrowLeft,
    MessageSquare,
    Phone,
    Video,
    UserCheck,
    UserX,
    UserPlus,
    UserMinus,
    CircleUser,
} from "lucide-react";
import { useCall } from "../../context/CallContext";
import { useSocketContext } from "../../context/socketContext";
import { formatLastSeen } from "../../utils/utils";

const FriendsProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const prevIdRef = useRef();
    const { startCall } = useCall();
    const { onlineUsers } = useSocketContext();

    const { user: myUser } = useSelector((state) => state.auth);
    const myId = myUser?._id;

    const {
        user,
        loading,
        error: userError,
    } = useSelector((state) => state.userProfile);
    const { sending, error: friendError } = useSelector(
        (state) => state.friends
    );

    useEffect(() => {
        if (!myUser?._id && !loading) dispatch(getMe());
    }, [dispatch, myUser, loading]);

    useEffect(() => {
        if (id && id !== prevIdRef.current) {
            dispatch(fetchUserById(id));
            dispatch(resetFriendState());
            prevIdRef.current = id;
        }
    }, [id, dispatch]);

    const handleAddFriend = async () => {
        await dispatch(sendFriendRequest(user._id));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleCancelRequest = async () => {
        await dispatch(cancelFriendRequest(user._id));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleAcceptRequest = async () => {
        await dispatch(
            manageFriendRequest({ requestId: user._id, action: "accept" })
        );
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleRejectRequest = async () => {
        await dispatch(
            manageFriendRequest({ requestId: user._id, action: "reject" })
        );
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleUnfriend = async () => {
        if (!window.confirm(`Are you sure you want to remove ${user.name} from your friends?`)) return;
        await dispatch(
            manageFriendRequest({ requestId: user._id, action: "unfriend" })
        );
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const hasSentRequest = myUser?.sentFriendRequests?.some(
        (r) => (r?._id || r) === user?._id
    );
    const isFriend = myUser?.friends?.some(
        (f) => (f?._id || f) === user?._id
    );
    const hasIncomingRequest = myUser?.friendRequests?.some(
        (r) => (r?._id || r) === user?._id
    );
    const isSelf = myId === user?._id;
    const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user?._id);

    if (userError) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                User not found or unavailable.
            </div>
        );
    }

    if (loading || !user || !myUser?._id) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                <div className="w-8 h-8 rounded-full border-2 border-[#00A1FF] border-t-transparent animate-spin mr-3" />
                Loading profile...
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-y-auto customScrollbar font-sans transition-colors duration-200">
            {/* Mobile Header */}
            <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800/80 md:hidden sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-20">
                <button
                    onClick={() => navigate("/friends")}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Friend Profile</h2>
            </div>

            {/* Banner / Cover Photo */}
            <div className="relative h-48 sm:h-64 md:h-80 w-full bg-gradient-to-r from-[#00A1FF]/30 via-blue-600/20 to-slate-900">
                {user.coverPhoto?.url && (
                    <img
                        src={user.coverPhoto.url}
                        className="w-full h-full object-cover"
                        alt="Banner"
                    />
                )}
                {/* Floating Avatar */}
                <div className="absolute -bottom-12 left-6 sm:left-10">
                    <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                            {user.profile_pic?.url ? (
                                <img
                                    src={user.profile_pic.url}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <CircleUser className="w-16 h-16 text-slate-400" />
                            )}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full ring-4 ring-white dark:ring-slate-950 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info & Actions Bar */}
            <div className="mt-16 px-6 sm:px-10 pb-6 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>{user.name}</span>
                        {isOnline ? (
                            <span className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Online
                            </span>
                        ) : (
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700/60">
                                {formatLastSeen(user.last_online || user.lastSeen)}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">{user.bio || "No status bio available."}</p>
                </div>

                {/* Dynamic Relationship Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    {isSelf ? (
                        <Link
                            to="/profile"
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                            Edit My Profile
                        </Link>
                    ) : isFriend ? (
                        <>
                            <button
                                onClick={() => navigate(`/chat/${user._id}`)}
                                className="bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#00A1FF]/25 active:scale-95 transition-all cursor-pointer"
                            >
                                <MessageSquare size={15} />
                                <span>Message</span>
                            </button>

                            <button
                                onClick={() =>
                                    startCall({
                                        userToCall: user._id,
                                        userName: user.name,
                                        userAvatar: user.profile_pic?.url,
                                        type: "voice",
                                    })
                                }
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00A1FF] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
                                title="Voice Call"
                            >
                                <Phone size={15} />
                                <span className="hidden sm:inline">Voice</span>
                            </button>

                            <button
                                onClick={() =>
                                    startCall({
                                        userToCall: user._id,
                                        userName: user.name,
                                        userAvatar: user.profile_pic?.url,
                                        type: "video",
                                    })
                                }
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00A1FF] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
                                title="Video Call"
                            >
                                <Video size={15} />
                                <span className="hidden sm:inline">Video</span>
                            </button>

                            <button
                                onClick={handleUnfriend}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-rose-500/20 active:scale-95 transition-all cursor-pointer"
                                title="Unfriend"
                            >
                                <UserMinus size={15} />
                                <span>Unfriend</span>
                            </button>
                        </>
                    ) : hasIncomingRequest ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleAcceptRequest}
                                disabled={sending}
                                className="bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#00A1FF]/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <UserCheck size={15} />
                                <span>{sending ? "Accepting..." : "Accept Request"}</span>
                            </button>
                            <button
                                onClick={handleRejectRequest}
                                disabled={sending}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <UserX size={15} />
                                <span>Decline</span>
                            </button>
                        </div>
                    ) : hasSentRequest ? (
                        <button
                            onClick={handleCancelRequest}
                            disabled={sending}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <UserX size={15} />
                            <span>{sending ? "Cancelling..." : "Cancel Request"}</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleAddFriend}
                            disabled={sending}
                            className="bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#00A1FF]/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <UserPlus size={15} />
                            <span>{sending ? "Sending..." : "Add Friend"}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Bio & Details */}
            <div className="p-6 sm:p-10 space-y-6">
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm dark:shadow-none backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        About
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {user.bio || "No details shared yet."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FriendsProfile;
