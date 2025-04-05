import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline } from "react-icons/io5";
import { CiSearch, CiSettings } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";

const ChatScreen = () => {
    return (
        <div className="flex flex-col flex-1 h-screen w-fit justify-between">
            <header className="flex bg-white border-1   border-[#DFDFDF] h-[4rem] pl-6 pr-6 items-center">
                <div className="rounded-full  h-10 w-10 bg-[#D9D9D9] flex justify-center items-center">
                    {/* <img
                    src="null"
                    className="rounded-full  h-10 w-10 bg-white"
                    alt="profile"
                /> */}
                    <FaUser className="text-2xl" />
                </div>
                <div className="ml-3">
                    <div className="name">name</div>
                    <div className="last-seen">last seen</div>
                </div>
                <div className="ml-auto">
                    <CiSearch className="text-[1rem]" />
                </div>
            </header>
            <div className="flex h-full bg-[#F5F5F5]"> Chat Body</div>
            <footer className="h-[80px] flex items-center justify-between w-full gap-2  bg-white border-1   border-[#DFDFDF] ">
                <div className="flex  h-full justify-center items-center">
                    {" "}
                    <div className="hover:bg-white/20 w-13 text-[20px] h-full flex justify-center items-center">
                        <BsEmojiSmile />
                    </div>{" "}
                    <div className="hover:bg-white/20 w-13 text-[20px] h-full flex justify-center items-center">
                        <TiAttachment />
                    </div>
                </div>
                <div className="w-[90%] h-full  ">
                    <input
                        type="text"
                        placeholder="Type a message"
                        name="massege"
                        className="w-full h-full outline-none "
                    />
                </div>
                <div className="hover:bg-white/20 w-13 text-[20px] h-full flex justify-center items-center">
                    <IoMicOutline />
                </div>
            </footer>
        </div>
    );
};

export default ChatScreen;
