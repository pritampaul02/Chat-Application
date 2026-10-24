import React, { useEffect, useState } from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { CircleUser, Plus, Search, Users, Video } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChaListFriends } from "../../store/chatList/chatAction";
import { useSocketContext } from "../../context/socketContext";
import { useCall } from "../../context/CallContext";
import { formatLastSeen } from "../../utils/utils";
import moment from "moment";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const SidebarChat = ({ isOpen = true, onClose }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { onlineUsers, socket } = useSocketContext();
    const { joinGroupCall } = useCall();

    const { loading, error, user } = useSelector((state) => state.chatList);
    const currentUser = useSelector((state) => state.auth.user);

    const formatLastOnline = (dateTime) => {
        if (!dateTime) return "";
        return formatLastSeen(dateTime);
    };

    useEffect(() => {
        dispatch(fetchChaListFriends());
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;
        const handleStatus = () => {
            dispatch(fetchChaListFriends());
        };
        socket.on("user:last-seen", handleStatus);
        socket.on("user-status-change", handleStatus);
        return () => {
            socket.off("user:last-seen", handleStatus);
            socket.off("user-status-change", handleStatus);
        };
    }, [socket, dispatch]);

    // Sort conversations so that whichever contact last messaged (sent or received) appears at the very top (index 0)
    const sortedFriends = [...(user?.friends || [])].sort((a, b) => {
        const timeA = a?.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
        const timeB = b?.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
        return timeB - timeA;
    });

    const filteredFriends = sortedFriends.filter((friend) =>
        friend?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isChatActiveOnMobile =
        location.pathname.startsWith("/chat/") &&
        location.pathname.split("/")[2]?.length > 0;

    const handleCreateGroupRoom = () => {
        const roomName = prompt("Enter a Room Name to start a Group Call:", `pulse-${Math.floor(Math.random() * 10000)}`);
        if (roomName) {
            joinGroupCall(roomName);
        }
    };

    const renderChats = () => {
        if (!filteredFriends || filteredFriends.length === 0) {
            return (
                <div className="py-12 text-center px-4">
                    <p className="text-slate-500 text-sm">
                        {searchTerm ? "No matching conversations found." : "No chats yet. Connect with friends to get started!"}
                    </p>
                </div>
            );
        }

        return filteredFriends.map((friend) => {
            const chatId = friend._id;
            const isActive = location.pathname === `/chat/${chatId}`;
            const isOnline =
                Array.isArray(onlineUsers) && onlineUsers.includes(chatId);

            const lastMessage = friend?.lastMessage;
            const hasLastMsg = Boolean(lastMessage?.message || lastMessage?.createdAt);

            let formattedTime = "";
            if (lastMessage?.createdAt) {
                const msgTime = moment(lastMessage.createdAt);
                formattedTime = msgTime.isSame(moment(), "day")
                    ? msgTime.format("h:mm A")
                    : msgTime.format("MMM D");
            }

            const isSenderLast =
                lastMessage?.type === "sender" ||
                String(lastMessage?.sender) === String(currentUser?._id);

            // Unread calculation: friend sent messages that have not been read by current user yet
            const unreadCount = Number(friend?.unreadCount ?? friend?.msgNotification ?? 0);
            const isUnread = !isActive && unreadCount > 0 && !isSenderLast;

            // Message tick status (visible when current user is the sender)
            const renderTick = () => {
                if (!isSenderLast || !lastMessage) return null;
                const status = lastMessage.status || (lastMessage.isRead ? "read" : "sent");

                if (status === "read") {
                    return <BsCheck2All className="text-[#00A1FF] text-sm font-bold shrink-0" />;
                }
                if (status === "delivered") {
                    return <BsCheck2All className="text-slate-400 text-sm shrink-0" />;
                }
                return <BsCheck2 className="text-slate-400 text-sm shrink-0" />;
            };

            return (
                <NavLink
                    to={`/chat/${chatId}`}
                    key={chatId}
                    onClick={onClose}
                    className={`w-full flex items-center px-4 py-3.5 transition-all duration-200 border-l-4 group relative ${
                        isActive
                            ? "bg-[#00A1FF]/10 dark:bg-[#00A1FF]/15 border-[#00A1FF] text-slate-900 dark:text-white font-medium"
                            : isUnread
                            ? "border-transparent bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                            : "border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                >
                    {/* Avatar with Online Indicator */}
                    <div className="relative shrink-0">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/60 flex items-center justify-center">
                            {friend?.profile_pic?.url ? (
                                <img
                                    src={friend?.profile_pic?.url || IMG_LINK}
                                    alt="avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <CircleUser className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        )}
                    </div>

                    {/* Chat Details */}
                    <div className="ml-3.5 flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h3
                                className={`text-sm truncate group-hover:text-[#00A1FF] transition-colors ${
                                    isUnread
                                        ? "font-bold text-black dark:text-white"
                                        : "font-semibold text-slate-800 dark:text-slate-200"
                                }`}
                            >
                                {friend?.name}
                            </h3>
                            <span
                                className={`text-[11px] shrink-0 ml-2 transition-colors ${
                                    isUnread
                                        ? "font-bold text-black dark:text-white"
                                        : "text-slate-400 dark:text-slate-500 font-normal"
                                }`}
                            >
                                {formattedTime || (isOnline ? "Online" : formatLastOnline(friend?.last_online || friend?.lastSeen))}
                            </span>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            {/* Message Preview */}
                            <div
                                className={`flex items-center gap-1.5 text-xs truncate flex-1 min-w-0 ${
                                    isUnread
                                        ? "text-black dark:text-white font-bold"
                                        : "text-slate-500 dark:text-slate-400 font-normal"
                                }`}
                            >
                                {renderTick()}
                                <span className="truncate">
                                    {lastMessage?.message || (hasLastMsg ? "Media" : "No messages yet")}
                                </span>
                            </div>

                            {/* Unread Message Count Badge and Dot */}
                            {isUnread && (
                                <div className="flex items-center gap-1 shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-[#00A1FF] animate-pulse" />
                                    <span className="bg-[#00A1FF] text-white font-extrabold text-[11px] min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center shadow-md shadow-[#00A1FF]/30">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </NavLink>
            );
        });
    };

    return (
        <aside
            className={`h-full w-full md:w-80 lg:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-10 transition-colors duration-200 ${
                isChatActiveOnMobile ? "hidden md:flex" : "flex"
            }`}
        >
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Chats</h1>
                    <button
                        onClick={handleCreateGroupRoom}
                        title="Start Group Call Room"
                        className="px-2.5 py-1.5 rounded-xl bg-[#00A1FF]/10 hover:bg-[#00A1FF]/20 text-[#00A1FF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#00A1FF]/30 active:scale-95 shadow-sm"
                    >
                        <Video size={14} />
                        <span>Group Call</span>
                    </button>
                </div>

                {/* Search Field */}
                <div className="relative flex items-center">
                    <Search
                        size={16}
                        className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-[#00A1FF] transition-colors"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto customScrollbar divide-y divide-slate-100 dark:divide-slate-800/40">
                {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                        Loading conversations...
                    </div>
                ) : error ? (
                    <div className="py-8 text-center text-xs text-rose-500 px-4">
                        {error}
                    </div>
                ) : (
                    renderChats()
                )}
            </div>
        </aside>
    );
};

export default SidebarChat;
