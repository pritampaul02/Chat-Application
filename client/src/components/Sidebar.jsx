import React from "react";

import { RiChatNewLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { BsPinAngleFill } from "react-icons/bs";

const Sidebar = () => {
    return (
        <div className="w-80 bg-white border-1 border-[#5E5E5E33]  p-4 pt-0 h-screen ">
            <div className="flex justify-between items-center h-16">
                <h1 className=" text-2xl font-medium ">Chats</h1>
                <RiChatNewLine className="ml-40" />
                <IoFilter />
            </div>
            <div className="h-7 w-full flex items-center border-1 BORDER-[#CCCFD0]  gap-2 rounded-[4px] bg-[#F2F2F2]">
                <CiSearch className="text-[1rem] " />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full outline-1 rounded-[4px] h-full outline-none"
                />{" "}
            </div>
            <p>
                {" "}
                <BsPinAngleFill />
                Pined chats
            </p>
            <p>All chats</p>
        </div>
    );
};

export default Sidebar;
