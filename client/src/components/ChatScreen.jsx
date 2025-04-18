import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline } from "react-icons/io5";
import { CiSearch, CiSettings } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
// import image from "../assets/wallpaper"

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const ChatScreen = () => {
    return (
        <div className="flex flex-col h-screen flex-1 justify-between">
            <header className="flex bg-white border-1   border-[#DFDFDF] h-[5.625rem] w-full pl-6  pr-6 items-center">
                <div className="rounded-full  h-10 w-10 bg-[#D9D9D9] flex justify-center items-center">
                    {/* <img
                    src="null"
                    className="rounded-full  h-10 w-10 bg-white"
                    alt="profile"
                /> */}
                    <FaUser className="text-2xl" />
                </div>
                <div className="ml-3">
                    <div className="name text-[1.25rem]">name</div>
                    <div className="last-seen text-[0.87rem]">last seen</div>
                </div>
                <div className="ml-auto h-full w-13 flex justify-center items-center hover:bg-[#F5F5F5] hover:rounded-[5px]">
                    <CiSearch className="text-[1rem]" />
                </div>
            </header>

            {/* Chat body */}
            <div className="flex h-full pt-0 pl-13 pr-17 pb-6 w-full bg-[url('/assets/download.png')] bg-cover object-cover bg-center">
                <div className="h-auto w-full overflow-scroll customScrollbar ">
                    <div className="w-[45%] flex items-center  gap-2  h-auto p-4">
                        <div className="h-18 flex items-center self-start  w-18">
                            <img
                                src={IMG_LINK}
                                alt="DP"
                                className=" object-cover rounded-full h-12 w-12 bg-[#f0f2f5]"
                            />
                        </div>
                        <div className="w-auto h-auto max-w-[90%] flex gap-2 flex-col ">
                            <div className="h-[1.25rem] w-auto text-[1.25rem] text-left flex items-center">
                                sdfs
                            </div>
                            <div className="h-auto relative bg-[#FFFFFF] border p-3 rounded-2xl border-[#E7E7E7]">
                                Lorem ipsum dolor sit amet consectetur iusto
                                deleniti consequuntur obcaecati ue, quibusdam
                                expedita, dolorem, soluta nesciunt a qui
                                corrupti beatae corporis ab debitis. In!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="h-[5rem] flex items-center justify-between z-1 w-full gap-2 p-2  bg-white border-1   border-[#DFDFDF] ">
                <div className="flex  h-full justify-center items-center">
                    {" "}
                    <div className=" hover:bg-[#F5F5F5] hover:rounded-[5px] w-13 text-[1.25rem] h-full flex justify-center items-center">
                        <BsEmojiSmile />
                    </div>{" "}
                    <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-13 text-[1.25rem] h-full flex justify-center items-center">
                        <TiAttachment />
                    </div>
                </div>
                <div className="w-[90%] h-full  ">
                    <input
                        type="text"
                        placeholder="Type a message"
                        name="massege"
                        className="w-full h-full outline-none"
                    />
                </div>
                <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-13 text-[1.25rem] h-full flex justify-center items-center">
                    <IoMicOutline />
                </div>
            </footer>
        </div>
    );
};

export default ChatScreen;
