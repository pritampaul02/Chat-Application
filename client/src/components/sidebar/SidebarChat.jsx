import React from "react";
import { RiChatNewLine } from "react-icons/ri";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Filter, Plus, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const SidebarChat = () => {
    const location = useLocation();

    // Generate chat items with proper routing
    const allChat = Array.from({ length: 100 }, (_, i) => {
        const chatId = i + 1;
        const isActive = location.pathname === `/chat/${chatId}`;

        return (
            <NavLink
                to={`/chat/${chatId}`}
                key={chatId}
                className={`w-full flex items-center pl-6 pr-6 py-3 hover:bg-[#00A3FF22] ${
                    isActive ? "bg-[#00A3FF33]" : ""
                }`}
            >
                <div className="flex-shrink-0">
                    <img
                        src={IMG_LINK}
                        alt="User avatar"
                        className="object-cover rounded-full h-12 w-12 bg-[#f0f2f5]"
                    />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <span className="text-[1rem] truncate">
                            Akash {chatId}
                        </span>
                        <div className="text-[12px] text-gray-500">6:28 pm</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 truncate">
                            Hello there!
                        </span>
                        <div className="bg-primary rounded-full h-4 w-4 flex justify-center items-center text-white text-xs">
                            1
                        </div>
                    </div>
                </div>
            </NavLink>
        );
    });

    return (
        <div className="w-[22rem] bg-white border-r border-[#5E5E5E33] h-screen flex flex-col">
            {/* Header */}
            <div className="flex flex-col w-full px-6 pb-3 pt-4">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-medium">Chats</h1>
                    <div className="flex gap-4">
                        <RiChatNewLine className="text-xl cursor-pointer" />
                        <Filter size={20} className="cursor-pointer" />
                    </div>
                </div>

                {/* Search */}
                <div className="h-10 w-full flex justify-between items-center">
                    <div className="h-10 w-[82%] opacity-70 hover:opacity-100 flex border border-[#CCCFD0] items-center gap-2 rounded-[8px] bg-white px-2">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded-[4px] h-full outline-none text-sm"
                        />
                    </div>
                    <button className="h-10 w-10 bg-primary hover:bg-primary/85 flex items-center justify-center rounded-[12px] text-white">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto customScrollbar">
                <div className="sticky top-0 bg-white z-10 flex items-center px-6 py-2">
                    <BsChatLeftTextFill className="text-[0.9rem] text-[#818181]" />
                    <p className="text-[#818181] ml-2 text-[0.7rem]">
                        ALL MESSAGES
                    </p>
                </div>
                <div className="pb-4">{allChat}</div>
            </div>
        </div>
    );
};

export default SidebarChat;
