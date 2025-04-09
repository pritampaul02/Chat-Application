import React from 'react';

const SidebarCommon = () => {
  const allChat = [];

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
            className=" object-cover border border-[#CCCFD0] rounded-full h-12 w-12 bg-[#f0f2f5]"
          />
        </div>
        <div className="flex-1 h-full flex justify-center flex-col">
          <div className="flex justify-between items-center">
            <span className="text-[1rem]">Akash</span>
          </div>
        </div>
      </div>,
    );
  }
  return (
    <div className="h-full w-full flex flex-col gap-0 pb-2 pt-2 overflow-scroll customScrollbar">
      {/* pined chat */}
      <div className="w-full flex flex-col gap-0 ">
        <div className="flex w-full h-8 items-center pl-6 pr-6 pb-0  ">
          <TbPinnedFilled className="text-[0.9rem] text-[#818181] " />
          <p className="text-[#818181] ml-2 text-[0.7rem] ">PINNED CHATS</p>
        </div>

        {/* list of pinned chats */}
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
  );
};

export default SidebarCommon;
