import React from 'react';

import { RiChatNewLine } from 'react-icons/ri';
import { TbPinnedFilled } from 'react-icons/tb';
import { BsChatLeftTextFill } from 'react-icons/bs';
import { Filter, Plus, Search } from 'lucide-react';

const IMG_LINK = 'https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png';

const Sidebar = () => {
  const pinChat = [];
  const allChat = [];
  for (let i = 0; i < 3; i++) {
    pinChat.push(
      <div
        key={i}
        className="w-full flex justify-center items-center cursor-pointer pl-6 pr-6 hover:bg-[#00A3FF33]"
      >
        <div className="h-18 flex items-center  w-18">
          <img
            src={IMG_LINK}
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
            <div className="bg-[#00A3FF] rounded-full h-auto w-auto  flex justify-center items-center text-white">
              1
            </div>
          </div>
        </div>
      </div>,
    );
  }

  for (let i = 0; i < 100; i++) {
    allChat.push(
      <div
        key={i}
        className="w-full flex justify-center items-center pl-6 cursor-pointer pr-6 hover:bg-[#00A3FF33]"
      >
        <div className="h-18 flex items-center  w-18">
          <img
            src={IMG_LINK}
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
            <div className="bg-primary rounded-full h-4 w-4 flex justify-center items-center text-white">
              1
            </div>
          </div>
        </div>
      </div>,
    );
  }

  return (
    <div className="w-[22rem] bg-white border-1 border-[#5E5E5E33] max-h-[100vh] pb-4">
      <div className="flex flex-col w-full px-6 pb-3">
        <div className="flex justify-between items-center  h-16">
          <h1 className=" text-2xl font-medium ">Chats</h1>
          <RiChatNewLine className="ml-40" />
          <Filter size={20} />
        </div>
        <div className="h-10 w-full  flex justify-between items-center ">
          {' '}
          <div className="h-10 w-[82%]  opacity-70 hover:opacity-100 flex  border border-[#CCCFD0]  items-center outline-none  gap-2 rounded-[8px] bg-white px-2">
            <Search />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-[4px] h-full outline-none"
            />
          </div>
          <button className="h-full w-10 bg-primary text-3xl flex items-center justify-center cursor-pointer hover:bg-primary/85  rounded-[12px] text-white text-[2.5rem]">
            <Plus />
          </button>
        </div>
      </div>

      <div className="h-full w-full flex flex-col gap-0 pb-2 pt-2 overflow-scroll customScrollbar">
        {/* pined chat */}
        <div className="w-full flex flex-col gap-0 ">
          <div className="flex w-full h-8 items-center pl-6 pr-6 pb-0  ">
            <TbPinnedFilled className="text-[0.9rem] text-[#818181] " />
            <p className="text-[#818181] ml-2 text-[0.7rem] ">PINNED CHATS</p>
          </div>

          {/* list of pinned chats*/}
          {pinChat}
        </div>
        {/* <hr className="text-[#ccc] pl-6 pr-6" /> */}

        {/* all chats */}
        <div className="w-full flex flex-col gap-0 pt-2 ">
          <div className="flex w-full h-8 items-center pl-6 pr-6">
            <BsChatLeftTextFill className="text-[0.9rem] text-[#818181] " />
            <p className="text-[#818181] ml-2 text-[0.7rem] ">ALL MESSAGES</p>
          </div>

          {/* list of all chats */}
          {allChat}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
