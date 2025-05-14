import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Filter, Plus, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { AllChat } from "../../mockData/AllChat";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const StatusSidebar = () => {
    const location = useLocation();

    // Generate chat items with proper routing
    const allChat = AllChat.map((el, i) => {
        const statusId = i + 1;
        const isActive = location.pathname === `/status/${statusId}`;

        return (
            <NavLink
                to={`/status/${statusId}`}
                key={statusId}
                className={`w-full flex items-center pl-6 pr-6 py-3 hover:bg-[#00A3FF22] ${
                    isActive ? "bg-[#00A3FF33]" : ""
                }`}
            >
                <div className="flex-shrink-0 border-gray-300 border-3 rounded-full">
                    <img
                        src={el.imgLink}
                        alt="User avatar"
                        className="object-cover rounded-full h-12 w-12  "
                    />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between flex-col ">
                        <span className="text-[1rem] truncate">
                            {el.name} {statusId}
                        </span>
                        <span className="text-[1rem] truncate text-gray-600">
                            {el.time}
                        </span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                        <span className="text-sm  truncate">
                            {el.message}
                        </span>
                        <div className="bg-primary rounded-full h-4 w-4 flex justify-center items-center text-white text-xs">
                            {el.msgNotification}
                        </div>
                    </div> */}
                </div>
            </NavLink>
        );
    });

    return (
        <div className="w-[22rem] bg-white border-r border-[#5E5E5E33] md:ml-14 h-screen flex flex-col">
            {/* Header */}
            <div className="flex flex-col w-full px-6 pb-3 pt-4">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-medium">Status</h1>
                    <div className="flex gap-4">
                        <Plus size={20} className=" cursor-pointer" />
                        <BsThreeDotsVertical
                            size={20}
                            className="cursor-pointer"
                        />
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

export default StatusSidebar;
