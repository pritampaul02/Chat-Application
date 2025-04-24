import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline } from "react-icons/io";

const ChatPanel = ({ chat }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="flex bg-white border-b border-[#DFDFDF] h-[5.625rem] items-center px-6">
                <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                    <h2 className="text-xl">{chat.name}</h2>
                    <p className="text-sm text-gray-500">Online</p>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-[url('/assets/chat-bg.png')] bg-cover">
                {chat.messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`max-w-[70%] p-3 rounded-lg mb-3 ${
                            msg.sent
                                ? "ml-auto bg-[#00A3FF] text-white rounded-tr-none"
                                : "mr-auto bg-white border border-[#E7E7E7] rounded-tl-none"
                        }`}
                    >
                        {msg.text}
                        <span className="block text-xs mt-1 opacity-70 text-right">
                            {msg.time}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <footer className="h-[5rem] bg-white border-t border-[#DFDFDF] p-4">
                <div className="flex items-center gap-2 h-full">
                    <BsEmojiSmile className="text-xl cursor-pointer" />
                    <TiAttachment className="text-xl cursor-pointer" />
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 h-full px-4 border rounded-full focus:outline-none"
                    />
                    <IoMicOutline className="text-xl cursor-pointer" />
                </div>
            </footer>
        </div>
    );
};

export default ChatPanel;
