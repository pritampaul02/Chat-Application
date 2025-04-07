import React from "react";
import { CiSearch } from "react-icons/ci";

const RightMenu = () => {
    return (
        <div className="w-80 border-1 border-[#5E5E5E33] p-4 rounded-[4px]  h-screen">
            <div className="h-7 w-full flex items-center border-1 BORDER-[#CCCFD0]  gap-2 rounded-[4px] bg-[#F2F2F2]">
                <CiSearch className="text-[1rem] " />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-[4px] h-full outline-none"
                />{" "}
            </div>
            <p>Pined chats</p>
            <p>All chats</p>
        </div>
    );
};

export default RightMenu;
