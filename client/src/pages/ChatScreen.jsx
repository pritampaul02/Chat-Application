import React, { useEffect, useState, useRef } from "react";
import { BsEmojiSmile, BsCheck2, BsCheck2All } from "react-icons/bs";
import { TiAttachment } from "react-icons/ti";
import { IoMicOutline, IoSend } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { HiArrowLeft } from "react-icons/hi";
import { ChevronsDown, EllipsisVertical } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    addMessage,
    fetchMessages,
    sendMessage,
    updateMessage,
    deletedMessage,
    reactedMessage,
    deletedReaction,
} from "../store/chat/chatSlice";
import { fetchUserById } from "../store/userProfile/userProfileAction";
import {
    deleteMessage,
    deleteReactToMessage,
    editMessage,
    reactToMessage,
} from "../store/message/messageAction";
import EmojiPicker from "emoji-picker-react";
import { getSocket } from "../store/socket/socketSlice";
const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

const LONG_PRESS_DURATION = 500; // 500ms
const MessageBubble = ({ message, isSender, showDate }) => {
    const [showActions, setShowActions] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReactionUsers, setShowReactionUsers] = useState(false);
    const dispatch = useDispatch();
    const pickerRef = useRef();
    const longPressTimerRef = useRef(null);

    const formattedTime = new Date(message?.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const editedTime = new Date(message?.editedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const handleEditMessage = () => {
        const updatedText = prompt("Edit your message:", message.message);
        if (updatedText) {
            dispatch(
                editMessage({ messageId: message._id, message: updatedText })
            );
        }
        setShowOptions(false);
    };

    const handleDeleteMessage = () => {
        dispatch(deleteMessage(message._id));
        setShowOptions(false);
    };

    const handleEmojiClick = (emojiData) => {
        dispatch(
            reactToMessage({ messageId: message._id, emoji: emojiData.emoji })
        );
        setShowEmojiPicker(false);
        setShowOptions(false);
    };

    // Handle long press detection
    const handlePressStart = () => {
        longPressTimerRef.current = setTimeout(() => {
            setShowActions(true);
            setShowOptions(false);
            setShowEmojiPicker(false);
        }, LONG_PRESS_DURATION);
    };

    const handlePressEnd = () => {
        clearTimeout(longPressTimerRef.current);
    };

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
                setShowReactionUsers(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close options when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".group") && !e.target.closest(".absolute")) {
                setShowOptions(false);
                setShowActions(false);
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // current date

    // console.log(formattedDate);

    const currentDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    //    if( message?.createdAt.toDateString() === currentDate.toDateString()) {
    // formatting the date
    const createdAt = new Date(message?.createdAt);
    const day = createdAt.getDate();
    const month = createdAt.toLocaleString("default", { month: "short" });
    const year = createdAt.getFullYear();

    const formatted = `${day} ${month} ${year}`;

    return (
        <>
            {showDate && (
                <div className="p-2 break-words flex justify-center items-center">
                    <p className="text-xs text-gray-500">
                        {new Date(message?.createdAt).toDateString() ===
                        currentDate.toDateString()
                            ? "Today"
                            : new Date(message?.createdAt).toDateString() ===
                              yesterday.toDateString()
                            ? "Yesterday"
                            : formatted}
                    </p>
                </div>
            )}
            <div
                className={`flex relative mb-4 px-2 sm:px-4 ${
                    isSender ? "justify-end" : "justify-start"
                }`}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
            >
                <div className="relative group max-w-[85%] sm:max-w-[75%] md:max-w-[60%]">
                    {/* current date */}

                    {/* Message Bubble */}
                    <div
                        className={`p-3 rounded-2xl text-sm break-words relative ${
                            isSender
                                ? "bg-primary text-white rounded-tr-none"
                                : "bg-white border border-gray-200 rounded-tl-none"
                        }`}
                    >
                        <p>{message?.message}</p>

                        {/* Timestamp and read status */}
                        <div className="mt-1 text-xs text-right flex items-center justify-end gap-1">
                            <span>
                                {!message.deleted && message.edited
                                    ? "Edited "
                                    : ""}
                                {!message.deleted && message.edited
                                    ? editedTime
                                    : formattedTime}
                            </span>
                            {isSender &&
                                !message.deleted &&
                                (message?.read ? (
                                    <BsCheck2All className="text-blue-100 text-sm" />
                                ) : (
                                    <BsCheck2 className="text-blue-100 text-sm" />
                                ))}
                        </div>

                        {/* Reaction Emoji (clickable) */}
                        {!message.deleted && message.reactions?.length > 0 && (
                            <div
                                className="absolute -bottom-4 left-0 px-1 py-0.5 rounded-full text-lg cursor-pointer"
                                onClick={() =>
                                    setShowReactionUsers((prev) => !prev)
                                }
                            >
                                {message.reactions.map((r, i) => (
                                    <span key={i}>{r.emoji}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Action Button */}
                    {showActions && (
                        <button
                            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
                            onClick={() => setShowOptions((prev) => !prev)}
                        >
                            <EllipsisVertical size={18} />
                        </button>
                    )}
                    {/* Dropdown Options */}
                    {showOptions && (
                        <div className="absolute top-10 right-0 z-30 bg-white shadow-lg rounded-md p-2 text-sm space-y-1 w-28">
                            {isSender && (
                                <>
                                    <button
                                        className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                                        onClick={handleEditMessage}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                                        onClick={handleDeleteMessage}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                            <button
                                className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                                onClick={() =>
                                    setShowEmojiPicker(!showEmojiPicker)
                                }
                            >
                                React
                            </button>
                        </div>
                    )}
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div
                            ref={pickerRef}
                            className="absolute top-16 right-0 z-40"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme="light"
                                height={350}
                                width={300}
                            />
                        </div>
                    )}

                    {/* Emoji Reaction Users List */}
                    {showReactionUsers && (
                        <div
                            className={`absolute top-full -left-40 md:top-full md:left-0 w-55 md:w-60 mt-2 bg-white border ${
                                isSender
                                    ? "translate-x-2"
                                    : "translate-x-45 md:translate-x-0    "
                            } border-gray-300 rounded shadow p-2 z-40`}
                        >
                            <p className="font-semibold mb-2 text-sm text-gray-700">
                                Reacted by:
                            </p>
                            <ul className="space-y-1 text-sm max-h-40 overflow-auto">
                                {message.reactions.map((r, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            title="Click to remove reaction"
                                            onClick={() => {
                                                dispatch(
                                                    deleteReactToMessage({
                                                        messageId: message._id,
                                                        emoji: r.emoji,
                                                    })
                                                );
                                            }}
                                            className="text-lg cursor-pointer"
                                        >
                                            {r.emoji}
                                        </span>
                                        <img
                                            src={r.user?.profile_pic?.url}
                                            alt="profile"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-gray-800">
                                            {r.user?.name}
                                        </span>
                                        <span className="text-gray-800">
                                            {new Date(
                                                r.reactedAt
                                            ).toLocaleString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const ChatHeader = ({ toggleSidebar, contact }) => {
    const navigate = useNavigate();
    return (
        <header className="flex items-center  bg-white border-b border-gray-200 h-16 px-4">
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
                onClick={() => navigate(`/friends/${contact.id}`)}
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

            <button className="p-2 rounded-full bg-primary text-white hover:opacity-80 transition">
                <CiSearch className="text-lg" />
            </button>
        </header>
    );
};

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const pickerRef = useRef(null);
    const dispatch = useDispatch();
    const { chatId } = useParams();

    const handleSendMessage = () => {
        if (!chatId) return;

        if (message.trim() || imageFile) {
            const formData = new FormData();
            formData.append("receiver", chatId);
            formData.append("receiverModel", "user");
            if (message.trim()) formData.append("message", message);
            if (imageFile) formData.append("image", imageFile);

            dispatch(sendMessage(formData));
            setMessage("");
            setImageFile(null);
            setShowEmojiPicker(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <footer className="bg-white  mb-0 border-t border-gray-200 p-2 sm:p-3 relative">
            {imageFile && (
                <div className="mb-2 relative w-fit">
                    <img
                        src={URL.createObjectURL(imageFile)}
                        alt="preview"
                        className="w-32 h-32 rounded-lg object-cover border"
                    />
                    <button
                        className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-2 py-0.5"
                        onClick={() => setImageFile(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2">
                <div className="relative">
                    <BsEmojiSmile
                        className="text-lg sm:text-xl text-gray-600 cursor-pointer"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                    />
                    {showEmojiPicker && (
                        <div
                            ref={pickerRef}
                            className="absolute bottom-12 left-0 z-30"
                        >
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                theme="light"
                                height={350}
                            />
                        </div>
                    )}
                </div>

                <TiAttachment
                    className="text-lg sm:text-xl text-gray-600 cursor-pointer"
                    onClick={openFileDialog}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    hidden
                />

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                        imageFile ? "Add a caption..." : "Type a message"
                    }
                    className="flex-1 py-2 px-4 rounded-full border border-gray-300 text-sm focus:outline-none"
                />

                <button
                    className="p-2 rounded-full bg-primary hover:opacity-80 transition"
                    onClick={handleSendMessage}
                >
                    {message.trim() || imageFile ? (
                        <IoSend className="text-lg text-white" />
                    ) : (
                        <IoMicOutline className="text-lg text-white" />
                    )}
                </button>
            </div>
        </footer>
    );
};

const ChatScreen = () => {
    const { toggleSidebar } = useOutletContext();
    const dispatch = useDispatch();
    const { chatId } = useParams();
    const { messages } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.userProfile);
    const userId = JSON.parse(sessionStorage.getItem("myUser"));
    // const { socket } = useSelector((state) => state.socket);

    const scrollContainerRef = useRef(null);
    const lastMessageRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const socket = getSocket();

    useEffect(() => {
        if (chatId) {
            dispatch(fetchMessages(chatId));
            dispatch(fetchUserById(chatId));
        }
    }, [chatId]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Listen for incoming messages from socket
    useEffect(() => {
        if (!socket) return;

        socket?.on("send-message", async ({ reciverId, chat }) => {
            // console.log("send message ------>", chat);

            dispatch(addMessage(chat));
        });

        socket?.on("message:updated", ({ receiverId, chat }) => {
            // console.log("Message edited:", chat);
            dispatch(updateMessage(chat)); // New action to update existing message
        });

        socket?.on("message:deleted", ({ receiverId, chat }) => {
            // console.log("Message deleted:", chat);
            dispatch(deletedMessage(chat)); // New action to update existing message
        });

        socket?.on("message:reacted", ({ receiverId, chat }) => {
            // console.log("Message reacted:", chat);
            dispatch(reactedMessage(chat)); // New action to update existing message
        });

        socket?.on("message:deletedReact", ({ receiverId, chat }) => {
            // console.log("Message deletedReact:", chat);
            dispatch(deletedReaction(chat)); // New action to update existing message
        });
        return () => {
            socket?.off("send-message");
            socket?.off("message:updated");
            socket?.off("message:deleted");
            socket?.off("message:reacted");
            socket?.off("message:deletedReact");
        };
    }, [socket, dispatch]);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        setShowScrollButton(
            container.scrollHeight - container.scrollTop >
                container.clientHeight + 100
        );
    };

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const contact = user
        ? {
              id: user._id,
              name: user.name,
              avatar: user.profile_pic?.url,
              status: "Online",
          }
        : "";

    return (
        <div className="flex flex-col h-full md:h-full relative">
            <ChatHeader toggleSidebar={toggleSidebar} contact={contact} />

            <div
                className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 bg-[url(https://res.cloudinary.com/dyyy9djvx/image/upload/v1751126205/download_adnznx.jpg)] "
                onScroll={handleScroll}
                ref={scrollContainerRef}
            >
                <div className="max-w-3xl mx-auto ">
                    {messages.map((msg, idx) => {
                        const currentDate = new Date(
                            msg.createdAt
                        ).toDateString();
                        const prevDate =
                            idx > 0
                                ? new Date(
                                      messages[idx - 1].createdAt
                                  ).toDateString()
                                : null;
                        const showDate = currentDate !== prevDate;

                        return (
                            <div
                                key={msg._id}
                                // ref={
                                //     idx === messages.length - 1
                                //         ? lastMessageRef
                                //         : null
                                // }
                            >
                                <MessageBubble
                                    message={msg}
                                    isSender={msg?.sender?._id === userId._id}
                                    showDate={showDate}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-28 right-4 bg-primary text-white p-2 rounded-full shadow-md"
                >
                    <ChevronsDown />
                </button>
            )}

            <MessageInput />
        </div>
    );
};

export default ChatScreen;
