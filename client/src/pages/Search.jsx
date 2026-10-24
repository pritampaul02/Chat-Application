import React, { useEffect, useMemo } from "react";
import { Search as SearchIcon, UserPlus, UserCheck, UserX, MessageSquare, CircleUser } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchUsers } from "../store/search/searchAction";
import { setQuery } from "../store/search/searchSlice";
import { resetFriendState } from "../store/friends/friendsSlice";
import {
    cancelFriendRequest,
    sendFriendRequest,
} from "../store/friends/friendsAction";
import { getMe } from "../store/auth/authActions";

const Search = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { users, query, loading, hasMore } = useSelector(
        (state) => state.search
    );
    const { sending, success } = useSelector((state) => state.friends);
    const currentUser = useSelector((state) => state.auth.user);
    const myId = currentUser?._id;

    const sentRequests = currentUser?.sentFriendRequests || [];
    const friends = currentUser?.friends || [];

    useEffect(() => {
        if (query) {
            dispatch(fetchUsers());
        }
    }, [dispatch, query]);

    const handleInputChange = (e) => {
        dispatch(setQuery(e.target.value));
    };

    const handleShowMore = () => {
        dispatch(fetchUsers());
    };

    useEffect(() => {
        dispatch(resetFriendState());
    }, [dispatch]);

    const handleSendReq = async (targetId) => {
        await dispatch(sendFriendRequest(targetId));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleCancelReq = async (targetId) => {
        await dispatch(cancelFriendRequest(targetId));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const dedupedUsers = useMemo(() => {
        const seen = new Set();
        return users.filter((user) => {
            if (seen.has(user._id)) return false;
            seen.add(user._id);
            return true;
        });
    }, [users]);

    const userList = useMemo(
        () =>
            dedupedUsers.map((user) => {
                const userPath = `/search/${user.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${user._id}`;
                const isActive = location.pathname === userPath;
                const isIam = myId === user._id;

                const isFriend = friends.some((f) => (f?._id || f) === user._id);
                const hasSent = sentRequests.some((r) => (r?._id || r) === user._id);

                return (
                    <div
                        key={user._id}
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${
                            isActive
                                ? "bg-slate-100 dark:bg-slate-800/80 border border-[#00A1FF]/40"
                                : "hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent"
                        }`}
                    >
                        <Link
                            to={userPath}
                            className="flex items-center gap-3 flex-1 min-w-0"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shrink-0">
                                {user.profile_pic?.url ? (
                                    <img
                                        src={user.profile_pic.url}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <CircleUser className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate hover:text-[#00A1FF]">
                                    {user.name}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {user.bio || "Member"}
                                </span>
                            </div>
                        </Link>

                        <div className="ml-2 shrink-0">
                            {isFriend ? (
                                <button
                                    onClick={() => navigate(`/chat/${user._id}`)}
                                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00A1FF] text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                    <MessageSquare size={13} />
                                    <span>Chat</span>
                                </button>
                            ) : hasSent ? (
                                <button
                                    onClick={() => handleCancelReq(user._id)}
                                    disabled={sending}
                                    className="bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
                                >
                                    Unsend
                                </button>
                            ) : isIam ? (
                                <button
                                    onClick={() => navigate(`/profile`)}
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer"
                                >
                                    Me
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSendReq(user._id)}
                                    disabled={sending}
                                    className="bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-md shadow-[#00A1FF]/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                >
                                    <UserPlus size={13} />
                                    <span>Add</span>
                                </button>
                            )}
                        </div>
                    </div>
                );
            }),
        [dedupedUsers, location.pathname, myId, friends, sentRequests, sending, navigate]
    );

    return (
        <aside className="w-full h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col gap-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Search & Explore</h1>
                <div className="relative flex items-center">
                    <SearchIcon size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search people by name..."
                        value={query}
                        onChange={handleInputChange}
                        className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#00A1FF]/50 transition-colors"
                    />
                </div>
            </div>

            {/* User Search Results */}
            <main className="flex-1 overflow-y-auto customScrollbar p-3 space-y-1">
                {loading && dedupedUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                        Searching members...
                    </div>
                ) : dedupedUsers.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 px-6">
                        {query ? "No users found." : "Type a name above to search for people."}
                    </div>
                ) : (
                    <>
                        {userList}
                        {hasMore && (
                            <div className="pt-2 text-center">
                                <button
                                    onClick={handleShowMore}
                                    className="text-xs text-[#00A1FF] hover:text-[#008fe6] font-semibold cursor-pointer"
                                >
                                    Load more...
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </aside>
    );
};

export default Search;
