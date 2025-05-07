import React from "react";
import { BsEmojiSmile, BsCheck2, BsCheck2All } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useOutletContext } from "react-router-dom";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

// Message Bubble Component
const MessageBubble = ({ message, isSender }) => {
    return (
        <div
            className={`flex mb-4 ${
                isSender ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] p-3 text-sm rounded-2xl ${
                    isSender
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                }`}
            >
                <p>{message.text}</p>
                {/* Timestamp + read indicator */}
                <div
                    className={`mt-1 text-xs ${
                        isSender ? "text-primary-100" : "text-gray-500"
                    } flex justify-end items-center`}
                >
                    <span>{message.time}</span>
                    {isSender && (
                        <span className="ml-1">
                            {message.read ? (
                                <BsCheck2All className="text-blue-100 text-sm" />
                            ) : (
                                <BsCheck2 className="text-blue-100 text-sm" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Chat Header Component
const ChatHeader = ({ toggleSidebar, contact }) => {
    const navigate = useNavigate();
    return (
        <header className="flex items-center bg-white border-b border-gray-200 h-16 px-4">
            {/* Back button - shown only on small screens */}
            <button
                className="md:hidden mr-3 p-2 rounded-full hover:bg-gray-100"
                onClick={() => {
                    navigate("/chat");
                    toggleSidebar();
                }}
            >
                <HiArrowLeft className="text-xl text-gray-700" />
            </button>

            <div className="rounded-full h-10 w-10 bg-gray-300 flex justify-center items-center">
                {contact.avatar ? (
                    <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="rounded-full h-full w-full object-cover"
                    />
                ) : (
                    <FaUser className="text-xl" />
                )}
            </div>

            <div className="ml-3 flex-1">
                <h2 className="font-medium">{contact.name}</h2>
                <p className="text-xs text-gray-500">{contact.status}</p>
            </div>

            <button className="p-2 rounded-full hover:bg-gray-100">
                <CiSearch className="text-lg" />
            </button>
        </header>
    );
};

// Message Input Component
const MessageInput = () => {
    const [message, setMessage] = React.useState("");

    return (
        <footer className="bg-white border-t border-gray-200 md:mb-0 mb-14 p-2 sm:p-3">
            <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <BsEmojiSmile className="text-lg sm:text-xl text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <TiAttachment className="text-lg sm:text-xl text-gray-600" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 py-2 px-4 rounded-full border border-gray-300 text-sm focus:outline-none"
                />
                <button className="p-2 rounded-full hover:bg-gray-100">
                    {message ? (
                        <IoSend className="text-lg text-primary" />
                    ) : (
                        <IoMicOutline className="text-lg text-gray-600" />
                    )}
                </button>
            </div>
        </footer>
    );
};

// Main ChatScreen Component
const ChatScreen = () => {
    const { toggleSidebar } = useOutletContext();
    // Mock data - replace with real data
    const contact = {
        name: "Akash Mondal",
        avatar: IMG_LINK,
        status: "Online",
    };

    const messages = [
        {
            id: 1,
            text: "Hey there! How are you doing?",
            time: "10:30 AM",
            sender: false,
            read: true,
        },
        {
            id: 2,
            text: "I'm good, thanks! Working on that project we discussed.",
            time: "10:32 AM",
            sender: true,
            read: true,
        },
        {
            id: 3,
            text: "That's great! When do you think you'll have the first draft ready?",
            time: "10:33 AM",
            sender: false,
            read: true,
        },
        {
            id: 4,
            text: "Probably by Friday. I'll send you an update tomorrow.",
            time: "10:35 AM",
            sender: true,
            read: false,
        },
        {
            id: 5,
            text: "Let's catch up this weekend.",
            time: "10:40 AM",
            sender: false,
            read: true,
        },
        {
            id: 6,
            text: "Sure, Saturday works for me.",
            time: "10:41 AM",
            sender: true,
            read: true,
        },
        {
            id: 7,
            text: "I'll bring snacks 😄",
            time: "10:42 AM",
            sender: false,
            read: true,
        },
        {
            id: 8,
            text: "Awesome! Can't wait.",
            time: "10:44 AM",
            sender: true,
            read: false,
        },
        {
            id: 9,
            text: "Can you share that PDF again?",
            time: "11:00 AM",
            sender: false,
            read: true,
        },
        {
            id: 10,
            text: "Sent it to your email.",
            time: "11:01 AM",
            sender: true,
            read: true,
        },

        {
            id: 11,
            text: "Got it, thanks!",
            time: "11:03 AM",
            sender: false,
            read: true,
        },
        {
            id: 12,
            text: "Any progress on the design?",
            time: "11:10 AM",
            sender: true,
            read: true,
        },
        {
            id: 13,
            text: "Yeah, I made a few updates.",
            time: "11:12 AM",
            sender: false,
            read: true,
        },
        {
            id: 14,
            text: "Looking forward to seeing it.",
            time: "11:13 AM",
            sender: true,
            read: true,
        },
        {
            id: 15,
            text: "Check your inbox now.",
            time: "11:15 AM",
            sender: false,
            read: true,
        },
        {
            id: 16,
            text: "Wow, that looks clean!",
            time: "11:17 AM",
            sender: true,
            read: true,
        },
        {
            id: 17,
            text: "Appreciate it!",
            time: "11:18 AM",
            sender: false,
            read: true,
        },
        {
            id: 18,
            text: "Will you join the meeting today?",
            time: "11:20 AM",
            sender: true,
            read: false,
        },
        {
            id: 19,
            text: "Yes, I'll be there by 2.",
            time: "11:21 AM",
            sender: false,
            read: false,
        },
        {
            id: 20,
            text: "Perfect. See you then!",
            time: "11:22 AM",
            sender: true,
            read: true,
        },
    ];

    return (
        <div className="flex flex-col h-full md:h-screen">
            <ChatHeader toggleSidebar={toggleSidebar} contact={contact} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 bg-gray-50 bg-[url('/assets/download.png')] bg-cover bg-center">
                <div className="max-w-3xl mx-auto">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isSender={message.sender}
                        />
                    ))}
                </div>
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatScreen;
