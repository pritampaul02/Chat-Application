import React, { use, useEffect } from "react";
import { BsEmojiSmile, BsCheck2, BsCheck2All } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    fetchMessages,
    sendMessage,
} from "../store/chat/chatSlice";
import { fetchUserById } from "../store/userProfile/userProfileAction";
import { useRef } from "react";
import socket from "../utils/socket";
// import socket from "../utils/socket";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

// Updated MessageBubble Component to handle isSender efficiently
const MessageBubble = ({ message, isSender }) => {
    const bubbleClasses = isSender
        ? "bg-primary text-white rounded-tr-none"
        : "bg-white border border-gray-200 rounded-tl-none";
    const textColor = isSender ? "text-primary" : "text-gray-500";

    return (
        <div
            className={`flex mb-4 ${
                isSender ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`max-w-[85%] sm:max-w-[70%] md:max-w-[60%] p-3 text-sm rounded-2xl ${bubbleClasses}`}
            >
                <p className="break-all">{message.message}</p>
                <div
                    className={`mt-1 text-xs ${textColor} flex justify-end items-center`}
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

            <div
                onClick={() => {
                    navigate(`/friends/${contact.id}`);
                }}
                className="rounded-full h-10 w-10 bg-gray-300 flex justify-center cursor-pointer items-center"
            >
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
    const dispatch = useDispatch();
    const { chatId } = useParams();
    const { messages } = useSelector((state) => state.chat);
    const handleSendMessage = () => {
        if (message.trim() && chatId) {
            const messageData = {
                message,
                receiver: chatId,
                receiverModel: "user",
            };

            dispatch(sendMessage(messageData));
            dispatch(fetchMessages(chatId));
            setMessage("");
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

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
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 py-2 px-4 rounded-full border border-gray-300 text-sm focus:outline-none"
                />
                <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    type="submit"
                    onClick={handleSendMessage}
                >
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

// Updated ChatScreen Component
const ChatScreen = () => {
    const { toggleSidebar } = useOutletContext();
    const dispatch = useDispatch();
    const { messages } = useSelector((state) => state.chat);
    const { chatId } = useParams();

    const userId = JSON.parse(sessionStorage.getItem("myUser"));
    const prevIdRef = useRef();
    const {
        user,
        loading,
        error: userError,
    } = useSelector((state) => state.userProfile);
    useEffect(() => {
        if (!chatId) return;
        dispatch(fetchMessages(chatId));
    }, [dispatch, chatId]);

    useEffect(() => {
        if (chatId !== prevIdRef.current) {
            dispatch(fetchUserById(chatId));
            prevIdRef.current = chatId;
        }
    }, [chatId, dispatch]);

    useEffect(() => {
        if (!chatId || !userId?._id) return;

        socket.emit("joinRoom", chatId);

        socket.on("send-message", ({ reciverId, chat }) => {
            if (reciverId === chatId) {
                dispatch(addMessage(chat)); // <-- Optimistically add
            }
        });

        socket.on("meg-sent", ({ sender, chat }) => {
            if (sender === userId._id) {
                dispatch(addMessage(chat)); // <-- Optimistically add
            }
        });

        return () => {
            socket.emit("leaveRoom", chatId);
            socket.off("send-message");
            socket.off("meg-sent");
        };
    }, [chatId, dispatch, userId?._id]);

    const contact = user
        ? {
              id: user._id,
              name: user.name,
              avatar: user.profile_pic?.url,
              status: "Online",
          }
        : {
              name: "Unknown",
              avatar: IMG_LINK,
              status: "Offline",
          };
    console.log("messages", messages);
    return (
        <div className="flex flex-col h-full md:h-screen">
            <ChatHeader toggleSidebar={toggleSidebar} contact={contact} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 bg-gray-50 bg-[url('/assets/download.png')] bg-cover bg-center">
                <div className="max-w-3xl mx-auto">
                    {messages?.map((message) => (
                        <MessageBubble
                            key={message?._id}
                            message={message}
                            isSender={message?.sender?._id === userId?._id}
                        />
                    ))}
                </div>
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatScreen;
