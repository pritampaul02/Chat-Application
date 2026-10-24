import React, { useEffect, useMemo, useState } from "react";
import { Search, UserCheck, UserX, MessageSquare, Phone, MoreVertical, CircleUser } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChaListFriends } from "../../store/chatList/chatAction";
import { manageFriendRequest } from "../../store/friends/friendsAction";
import { getMe } from "../../store/auth/authActions";
import { useSocketContext } from "../../context/socketContext";
import { useCall } from "../../context/CallContext";

const UserCard = ({
    user,
    showActions,
    onConfirm,
    onDelete,
    onUnfriend,
    isFriend,
    isOnline,
    actionLoading,
}) => {
    const navigate = useNavigate();
    const { startCall } = useCall();
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="flex items-center p-3.5 gap-3 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-2xl transition-colors duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-800/60 relative group">
            <Link to={`/friends/${user._id}`} className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                    {user.profile_pic?.url ? (
                        <img
                            src={user.profile_pic.url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <CircleUser className="w-8 h-8 text-slate-400" />
                    )}
                </div>
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <Link to={`/friends/${user._id}`} className="truncate">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-[#00A1FF] truncate transition-colors">
                            {user.name}
                        </h3>
                    </Link>
                    <span className="text-[10px] text-slate-500 shrink-0">
                        {isOnline ? "Online" : user.time || ""}
                    </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.bio || (user.mutual ? `${user.mutual} mutual friends` : "PulseChat member")}
                </p>

                {/* Friend Request Actions */}
                {showActions && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => onConfirm(user._id)}
                            disabled={actionLoading}
                            className="bg-[#00A1FF] hover:bg-[#008fe6] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-[#00A1FF]/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <UserCheck size={14} />
                            <span>Confirm</span>
                        </button>
                        <button
                            onClick={() => onDelete(user._id)}
                            disabled={actionLoading}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all cursor-pointer disabled:opacity-50 border border-slate-200 dark:border-slate-700/60"
                        >
                            <UserX size={14} />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Direct Friend Quick Actions */}
            {isFriend && (
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => navigate(`/chat/${user._id}`)}
                        title="Direct Message"
                        className="p-2 rounded-xl text-slate-400 hover:text-[#00A1FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <MessageSquare size={16} />
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
                        title="Voice Call"
                        className="p-2 rounded-xl text-slate-400 hover:text-[#00A1FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
                    >
                        <Phone size={16} />
                    </button>
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showOptions && (
                        <div className="absolute top-12 right-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl p-1 text-xs">
                            <button
                                onClick={() => {
                                    onUnfriend(user._id);
                                    setShowOptions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                                Unfriend
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const SideBarFriend = () => {
    const { socket, onlineUsers } = useSocketContext();
    const [activeTab, setActiveTab] = useState("Friend Requests");
    const [search, setSearch] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.chatList);

    useEffect(() => {
        dispatch(fetchChaListFriends());
    }, [dispatch]);

    const TABS = useMemo(() => ["Friend Requests", "All Friends"], []);

    const filteredFriends = useMemo(() => {
        return (
            user?.friends?.filter((u) =>
                u.name?.toLowerCase().includes(search.toLowerCase())
            ) || []
        );
    }, [user?.friends, search]);

    const handleAcceptRequest = async (requestId) => {
        setActionLoadingId(requestId);
        try {
            await dispatch(
                manageFriendRequest({ requestId, action: "accept" })
            ).unwrap();
            dispatch(fetchChaListFriends());
            dispatch(getMe());
        } catch (err) {
            console.error("Accept friend request failed:", err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRejectRequest = async (requestId) => {
        setActionLoadingId(requestId);
        try {
            await dispatch(
                manageFriendRequest({ requestId, action: "reject" })
            ).unwrap();
            dispatch(fetchChaListFriends());
            dispatch(getMe());
        } catch (err) {
            console.error("Reject friend request failed:", err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleUnfriend = async (requestId) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        try {
            await dispatch(
                manageFriendRequest({ requestId, action: "unfriend" })
            ).unwrap();
            dispatch(fetchChaListFriends());
            dispatch(getMe());
        } catch (err) {
            console.error("Unfriend failed:", err);
        }
    };

    // Socket event sync for friend requests
    useEffect(() => {
        if (!socket) return;

        const refreshFriends = () => {
            dispatch(fetchChaListFriends());
            dispatch(getMe());
        };

        socket.on("friendRequest", refreshFriends);
        socket.on("sendFriendRequest", refreshFriends);
        socket.on("manageFriendReq", refreshFriends);
        socket.on("manageSendFriendReq", refreshFriends);

        return () => {
            socket.off("friendRequest", refreshFriends);
            socket.off("sendFriendRequest", refreshFriends);
            socket.off("manageFriendReq", refreshFriends);
            socket.off("manageSendFriendReq", refreshFriends);
        };
    }, [socket, dispatch]);

    const friendRequestsCount = user?.friendRequests?.length || 0;
    const allFriendsCount = user?.friends?.length || 0;

    return (
        <aside className="w-full h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Header Tabs */}
            <header className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col gap-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Friends</h1>
                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        const count = tab === "Friend Requests" ? friendRequestsCount : allFriendsCount;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isActive
                                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }`}
                            >
                                <span>{tab}</span>
                                {count > 0 && (
                                    <span
                                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                            isActive
                                                ? "bg-[#00A1FF] text-white"
                                                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center">
                    <Search size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search friends..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#00A1FF]/50 transition-colors"
                    />
                </div>
            </header>

            {/* List Body */}
            <main className="flex-1 overflow-y-auto customScrollbar p-2 divide-y divide-slate-100 dark:divide-slate-800/30">
                {activeTab === "Friend Requests" ? (
                    friendRequestsCount === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 px-6">
                            No pending friend requests.
                        </div>
                    ) : (
                        user?.friendRequests?.map((reqUser) => (
                            <UserCard
                                key={reqUser._id}
                                user={reqUser}
                                showActions
                                onConfirm={handleAcceptRequest}
                                onDelete={handleRejectRequest}
                                actionLoading={actionLoadingId === reqUser._id}
                                isOnline={Array.isArray(onlineUsers) && onlineUsers.includes(reqUser._id)}
                            />
                        ))
                    )
                ) : filteredFriends.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 px-6">
                        {search ? "No matching friends found." : "No friends yet. Search and add friends!"}
                    </div>
                ) : (
                    filteredFriends.map((fUser) => (
                        <UserCard
                            key={fUser._id}
                            user={fUser}
                            isFriend
                            onUnfriend={handleUnfriend}
                            isOnline={Array.isArray(onlineUsers) && onlineUsers.includes(fUser._id)}
                        />
                    ))
                )}
            </main>
        </aside>
    );
};

export default SideBarFriend;
