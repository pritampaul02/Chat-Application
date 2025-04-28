import React from "react";
import { BsEmojiSmile, BsCheck2, BsCheck2All } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { AllChat } from "../mockData/AllChat";

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
                className={`max-w-[75%] p-3 rounded-2xl ${
                    isSender
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none"
                }`}
            >
                <p className="text-sm">{message.text}</p>
                <div
                    className={`flex items-center mt-1 text-xs ${
                        isSender ? "text-primary-100" : "text-gray-500"
                    }`}
                >
                    <div
                        className={`flex w-full
                             justify-end
                        `}
                    >
                        {" "}
                        <span className="select-none">{message.time}</span>
                    </div>

                    {isSender && (
                        <span className="ml-1">
                            {message.read ? (
                                <BsCheck2All className="text-blue-100  text-[16px]" />
                            ) : (
                                <BsCheck2 className="text-blue-100  text-[16px]" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Chat Header Component
const ChatHeader = ({ contact }) => {
    return (
        <header className="flex items-center bg-white border-b border-gray-200 h-16 px-4">
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
        <footer className="bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <BsEmojiSmile className="text-xl text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <TiAttachment className="text-xl text-gray-600" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <button className="p-2 rounded-full hover:bg-gray-100">
                    {message ? (
                        <IoSend className="text-xl text-primary" />
                    ) : (
                        <IoMicOutline className="text-xl text-gray-600" />
                    )}
                </button>
            </div>
        </footer>
    );
};

// Main ChatScreen Component
const ChatScreen = () => {
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
        <div className="flex flex-col h-screen">
            <ChatHeader contact={contact} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 bg-opacity-50 bg-[url('/assets/download.png')] bg-cover bg-center">
                <div className="max-w-4xl mx-auto">
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
