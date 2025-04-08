import React from "react";

import { RiChatNewLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";
import { BsChatLeftTextFill } from "react-icons/bs";

const Sidebar = () => {
    const pinChat = [];
    const allChat = [];
    for (let i = 0; i < 3; i++) {
        pinChat.push(
            <div
                key={i}
                className="w-full flex justify-center items-center pl-6 pr-6 hover:bg-[#00A3FF33]"
            >
                <div className="h-18 flex items-center  w-18">
                    <img
                        src=""
                        alt="DP"
                        className=" object-cover rounded-full h-12 w-12 bg-[#f0f2f5]"
                    />
                </div>
                <div className="flex-1 h-full flex justify-center flex-col">
                    <div className="flex justify-between items-center">
                        <span className="text-[1rem]">Akash</span>
                        <div className="text-[12px]">6:28 pm</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Akash: hello there!</span>
                        <div className="bg-[#00A3FF] rounded-full h-4 w-4 flex justify-center items-center text-white">
                            1
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    for (let i = 0; i < 100; i++) {
        allChat.push(
            <div
                key={i}
                className="w-full flex justify-center items-center pl-6 pr-6 hover:bg-[#00A3FF33]"
            >
                <div className="h-18 flex items-center  w-18">
                    <img
                        src=""
                        alt="DP"
                        className=" object-cover rounded-full h-12 w-12 bg-[#f0f2f5]"
                    />
                </div>
                <div className="flex-1 h-full flex justify-center flex-col">
                    <div className="flex justify-between items-center">
                        <span className="text-[1rem]">Akash</span>
                        <div className="text-[12px]">6:28 pm</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Akash: hello there!</span>
                        <div className="bg-[#00A3FF] rounded-full h-4 w-4 flex justify-center items-center text-white">
                            1
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[400px] bg-white border-1 border-[#5E5E5E33]    max-h-[100vh] ">
            <div className="flex flex-col w-full pl-6 pr-6 ">
                <div className="flex justify-between items-center  h-16">
                    <h1 className=" text-2xl font-medium ">Chats</h1>
                    <RiChatNewLine className="ml-40" />
                    <IoFilter />
                </div>
                <div className="h-10 w-full  flex justify-between items-center ">
                    {" "}
                    <div className="h-10 w-[80%]  opacity-70 hover:opacity-100 flex  border border-[#CCCFD0]  items-center outline-none  gap-2 rounded-[8px] bg-[#Fff]">
                        <CiSearch className="text-[1rem] ml-1 " />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full rounded-[4px] h-full outline-none"
                        />{" "}
                    </div>
                    <button className="h-full w-10 bg-primary text-3xl flex items-center justify-center pb-2  rounded-[12px] text-white text-[2.5rem]">
                        +
                    </button>
                </div>
            </div>

            <div className="h-full w-full flex flex-col gap-0 pb-2 pt-2 overflow-scroll customScrollbar">
                {/* pined chat */}
                <div className="w-full flex flex-col gap-0 ">
                    <div className="flex w-full h-8 items-center pl-6 pr-6 pb-0  ">
                        <TbPinnedFilled className="text-[0.9rem] text-[#818181] " />
                        <p className="text-[#818181] ml-2 text-[0.7rem] ">
                            PINNED CHATS
                        </p>
                    </div>

                    {/* list of pinned chats*/}
                    {pinChat}
                </div>
                {/* <hr className="text-[#ccc] pl-6 pr-6" /> */}

                {/* all chats */}
                <div className="w-full flex flex-col gap-0 pt-2 ">
                    <div className="flex w-full h-8 items-center pl-6 pr-6">
                        <BsChatLeftTextFill className="text-[0.9rem] text-[#818181] " />
                        <p className="text-[#818181] ml-2 text-[0.7rem] ">
                            ALL MESSAGES
                        </p>
                    </div>

                    {/* list of all chats */}
                    {allChat}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
