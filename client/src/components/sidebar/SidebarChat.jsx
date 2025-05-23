import React, { useEffect, useState } from "react";
import { RiChatNewLine } from "react-icons/ri";
import { BsChatLeftTextFill, BsCheck2, BsCheck2All } from "react-icons/bs";
import { Filter, Plus, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChaListFriends } from "../../store/chatList/chatAction";
import { FaMillSign } from "react-icons/fa6";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const SidebarChat = ({ isOpen = true, onClose }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

    const { loading, error, user } = useSelector((state) => state.chatList);

    useEffect(() => {
        dispatch(fetchChaListFriends());
    }, [dispatch]);

    const filteredFriends = user?.friends?.filter((friend) =>
        friend?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderChats = () => {
        if (!filteredFriends || filteredFriends.length === 0) {
            return (
                <p className="px-6 text-gray-500 text-sm pt-2">
                    {searchTerm ? "No matches found." : "No chats available."}
                </p>
            );
        }

        return filteredFriends.map((friend) => {
            const chatId = friend._id;
            const isActive = location.pathname === `/chat/${chatId}`;
            const lastSeen = friend?.lastSeen
                ? new Date(friend.lastSeen).toLocaleTimeString()
                : "";
            const formattedTime = new Date(
                friend?.lastMessage?.createdAt
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            const editedTime = new Date(
                friend?.lastMessage?.editedAt
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            return (
                <NavLink
                    to={`/chat/${chatId}`}
                    key={chatId}
                    onClick={onClose}
                    className={`w-full flex items-center px-6 py-3 hover:bg-[#00A3FF22] ${
                        isActive ? "bg-[#00A3FF33]" : ""
                    }`}
                >
                    {friend?.profile_pic?.url ? (
                        <img
                            src={friend?.profile_pic?.url || IMG_LINK}
                            alt="avatar"
                            className="h-12 w-12 rounded-full object-cover bg-[#f0f2f5]"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <CircleUser className="w-16 h-16" />
                        </div>
                    )}

                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className="text-[1rem]  truncate">
                                {friend?.name}
                            </span>
                            {friend?.msgNotification && (
                                <div className="bg-primary rounded-full h-4 w-4 flex justify-center items-center text-white text-xs">
                                    <span>{friend?.msgNotification || ""}</span>{" "}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            {friend.lastMessage?.type === "receiver" ? (
                                <span className="text-sm text-gray-600 truncate flex gap-3 items-center">
                                    {friend.lastMessage?.isRead ? (
                                        <BsCheck2 className="text-gray-600 text-sm transition" />
                                    ) : (
                                        <BsCheck2All className="text-gray-600 text-sm transition" />
                                    )}

                                    {friend?.lastMessage?.message || ""}
                                </span>
                            ) : friend.lastMessage?.type === "sender" ? (
                                <span className="text-sm text-gray-600 truncate">
                                    {friend?.lastMessage?.message || ""}
                                </span>
                            ) : null}

                            <span className="text-[12px] text-gray-500">
                                {friend.lastMessage?.edited
                                    ? editedTime && editedTime
                                    : formattedTime && formattedTime}
                            </span>
                        </div>
                    </div>
                </NavLink>
            );
        });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {/* {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={onClose}
                />
            )} */}

            {/* Sidebar Container */}
            <div
                className={`fixed md:ml-14 bg-white z-0 top-0 left-0 h-full w-[100%] sm:w-[22rem]  border-r border-[#5E5E5E33] transition-transform duration-300 ease-in-out
                ${
                    isOpen ? "translate-x-0" : "-translate-x-full "
                } md:translate-x-0 md:static md:z-0`}
            >
                {/* Header */}
                <div className="flex flex-col px-6 pt-4 pb-3">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-medium">Chats</h1>
                        <div className="flex gap-4">
                            <RiChatNewLine className="text-xl cursor-pointer" />
                            <Filter size={20} className="cursor-pointer" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-[#CCCFD0] rounded-[8px] px-2 w-full">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full outline-none text-sm px-2 py-1"
                            />
                        </div>
                        <button className="h-10 w-10 bg-primary hover:bg-primary/85 text-white rounded-[12px] flex items-center justify-center">
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto customScrollbar">
                    <div className="sticky top-0 bg-white z-10 flex items-center px-6 py-2 ">
                        <BsChatLeftTextFill className="text-sm text-[#818181]" />
                        <p className="ml-2 text-[#818181] text-xs">
                            ALL MESSAGES
                        </p>
                    </div>
                    <div className="pb-4">
                        {
                            // loading ? (
                            //     <p className="px-6 py-2 text-sm">
                            //         Loading chats...
                            //     </p>
                            // ) :
                            error ? (
                                <p className="px-6 py-2 text-sm text-red-500">
                                    {error}
                                </p>
                            ) : (
                                renderChats()
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidebarChat;
