import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import {
  Phone,
  Video,
  Users,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  ChevronsDown,
  X,
  User,
  Lock,
} from "lucide-react";
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
  markAllMessagesAsRead,
  clearMessages,
} from "../store/chat/chatSlice";
import { fetchUserById } from "../store/userProfile/userProfileAction";
import {
  deleteMessage,
  deleteReactToMessage,
  editMessage,
  reactToMessage,
} from "../store/message/messageAction";
import {
  resetFriendUnreadCount,
  updateFriendLastMessage,
} from "../store/chatList/chatListSlice";
import EmojiPicker from "emoji-picker-react";
import { useSocketContext } from "../context/socketContext";
import { useCall } from "../context/CallContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../utils/axios";
import { formatLastSeen } from "../utils/utils";

const LONG_PRESS_DURATION = 400;

// Subcomponent: Message Bubble
const MessageBubble = ({ message, isSender, showDate }) => {
  const [showActions, setShowActions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionUsers, setShowReactionUsers] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const { theme } = useTheme();
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
    if (updatedText && updatedText.trim() !== message.message) {
      dispatch(
        editMessage({ messageId: message._id, message: updatedText.trim() }),
      );
    }
    setShowOptions(false);
  };

  const handleDeleteMessage = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      dispatch(deleteMessage(message._id));
    }
    setShowOptions(false);
  };

  const handleEmojiClick = (emojiData) => {
    dispatch(
      reactToMessage({ messageId: message._id, emoji: emojiData.emoji }),
    );
    setShowEmojiPicker(false);
    setShowOptions(false);
  };

  const handlePressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowActions(true);
    }, LONG_PRESS_DURATION);
  };

  const handlePressEnd = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
      if (!e.target.closest(".msg-bubble-container")) {
        setShowOptions(false);
        setShowActions(false);
        setShowReactionUsers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Status tick renderer with enhanced dark & light contrast
  const renderStatusTicks = () => {
    if (!isSender || message.deleted) return null;

    const status =
      message.status || (message.read || message.isRead ? "read" : "sent");

    if (status === "sending") {
      return (
        <span
          title="Sending..."
          className="inline-flex items-center text-white/50 ml-1"
        >
          <BsCheck2 className="w-4 h-4 opacity-40 animate-pulse" />
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span
          title="Failed to send"
          className="inline-flex items-center text-rose-300 ml-1 font-bold"
        >
          !
        </span>
      );
    }
    if (status === "read") {
      return (
        <span
          title="Read"
          className="inline-flex items-center text-[#00f0ff] ml-1"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0, 30, 80, 0.7))" }}
        >
          <BsCheck2All className="w-4 h-4 text-[#00f0ff]" />
        </span>
      );
    }
    if (status === "delivered") {
      return (
        <span
          title="Delivered"
          className="inline-flex items-center text-white/75 ml-1"
        >
          <BsCheck2All className="w-4 h-4" />
        </span>
      );
    }
    return (
      <span
        title="Sent"
        className="inline-flex items-center text-white/60 ml-1"
      >
        <BsCheck2 className="w-4 h-4" />
      </span>
    );
  };

  // Media file extraction
  const mediaUrl =
    message?.media?.url ||
    message?.image?.url ||
    (typeof message?.image === "string" ? message.image : null);
  const isVideo =
    message?.media?.type === "video" ||
    (mediaUrl &&
      (mediaUrl.endsWith(".mp4") ||
        mediaUrl.endsWith(".webm") ||
        mediaUrl.includes("/video/upload/")));

  return (
    <>
      {showDate && (
        <div className="py-3 flex justify-center items-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-3.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm select-none">
            {(() => {
              const createdDate = new Date(message?.createdAt);
              const today = new Date();
              const diffDays = Math.floor(
                (today.setHours(0, 0, 0, 0) -
                  createdDate.setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24),
              );

              if (diffDays === 0) return "Today";
              if (diffDays === 1) return "Yesterday";
              if (diffDays > 1 && diffDays <= 6)
                return new Date(message?.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                  },
                );

              return new Date(message?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            })()}
          </span>
        </div>
      )}

      <div
        className={`msg-bubble-container flex relative mb-2.5 px-2 sm:px-4 ${
          isSender ? "justify-end" : "justify-start"
        }`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <div className="relative group max-w-[85%] sm:max-w-[72%] md:max-w-[60%]">
          {/* Message Bubble Card */}
          <div
            className={`p-3 sm:px-3.5 rounded-2xl text-[14px] leading-relaxed break-words relative transition-all duration-150 animate-message ${
              isSender
                ? "bg-gradient-to-br from-[#00A1FF] to-[#0082de] text-white rounded-tr-xs shadow-md shadow-[#00A1FF]/20 border border-[#00A1FF]/40"
                : "bg-white dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs shadow-sm dark:shadow-md dark:shadow-black/25 border border-slate-200/90 dark:border-slate-700/60"
            }`}
          >
            {/* Attached Image or Video */}
            {mediaUrl && (
              <div className="mb-2 overflow-hidden rounded-xl bg-black/20">
                {isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full max-h-72 object-contain rounded-xl"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Attachment"
                    onClick={() => setShowMediaPreview(true)}
                    className="w-full max-h-72 object-cover rounded-xl cursor-pointer hover:scale-[1.01] transition-transform duration-200"
                  />
                )}
              </div>
            )}

            {/* Message Text Content */}
            {message.deleted ? (
              <p className="italic opacity-60 text-xs">
                This message was deleted
              </p>
            ) : (
              <p className="whitespace-pre-wrap select-text font-normal">
                {message?.message}
              </p>
            )}

            {/* Footer: Time and Status */}
            <div
              className={`mt-1 text-[11px] text-right flex items-center justify-end gap-1 select-none font-medium ${
                isSender
                  ? "text-sky-100/80"
                  : "text-slate-400 dark:text-slate-400"
              }`}
            >
              <span>
                {!message.deleted && message.edited ? "edited " : ""}
                {!message.deleted && message.edited
                  ? editedTime
                  : formattedTime}
              </span>
              {renderStatusTicks()}
            </div>

            {/* Reaction Badges */}
            {!message.deleted && message.reactions?.length > 0 && (
              <div
                className="absolute -bottom-2.5 left-2 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer shadow-md flex items-center gap-1 hover:scale-105 transition-transform"
                onClick={() => setShowReactionUsers((prev) => !prev)}
              >
                {message.reactions.map((r, i) => (
                  <span key={i}>{r.emoji}</span>
                ))}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold ml-0.5">
                  {message.reactions.length}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Hover Button */}
          <button
            className={`opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-1.5 right-1.5 p-1 rounded-full backdrop-blur-md transition-opacity duration-150 cursor-pointer shadow-sm ${
              isSender
                ? "bg-black/25 hover:bg-black/40 text-white/90"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200"
            }`}
            onClick={() => setShowOptions((prev) => !prev)}
            title="Options"
          >
            <MoreVertical size={13} />
          </button>

          {/* Dropdown Menu */}
          {showOptions && (
            <div className="absolute top-8 right-0 z-40 bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-200 space-y-1 w-28 backdrop-blur-xl animate-in fade-in zoom-in-95">
              {isSender && !message.deleted && (
                <>
                  <button
                    className="w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    onClick={handleEditMessage}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full text-left hover:bg-rose-500/15 text-rose-500 dark:text-rose-400 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    onClick={handleDeleteMessage}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                className="w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700/70 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowOptions(false);
                }}
              >
                React
              </button>
            </div>
          )}

          {/* Emoji Reaction Picker */}
          {showEmojiPicker && (
            <div
              ref={pickerRef}
              className={`absolute z-50 bottom-12 ${
                isSender ? "right-0" : "left-0"
              } shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700`}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={theme === "dark" ? "dark" : "light"}
                height={340}
                width={290}
              />
            </div>
          )}

          {/* Reactions Drawer */}
          {showReactionUsers && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2.5 z-40 backdrop-blur-xl">
              <p className="font-semibold mb-2 text-xs text-slate-500 dark:text-slate-400">
                Reacted by
              </p>
              <ul className="space-y-1.5 text-xs max-h-36 overflow-auto customScrollbar">
                {message.reactions.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{r.emoji}</span>
                      <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                        {r.user?.name || "User"}
                      </span>
                    </div>
                    {r.user?._id === message.sender?._id && (
                      <button
                        onClick={() => {
                          dispatch(
                            deleteReactToMessage({
                              messageId: message._id,
                              emoji: r.emoji,
                            }),
                          );
                          setShowReactionUsers(false);
                        }}
                        className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Media Preview Modal */}
      {showMediaPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowMediaPreview(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-slate-900/60 cursor-pointer"
            onClick={() => setShowMediaPreview(false)}
          >
            <X size={24} />
          </button>
          <img
            src={mediaUrl}
            alt="Full Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

// Subcomponent: Chat Header
const ChatHeader = ({ toggleSidebar, contact, isOnline, isTyping }) => {
  const navigate = useNavigate();
  const { startCall, joinGroupCall } = useCall();

  const handleVoiceCall = () => {
    if (!contact?.id) return;
    startCall({
      userToCall: contact.id,
      userName: contact.name,
      userAvatar: contact.avatar,
      type: "voice",
    });
  };

  const handleVideoCall = () => {
    if (!contact?.id) return;
    startCall({
      userToCall: contact.id,
      userName: contact.name,
      userAvatar: contact.avatar,
      type: "video",
    });
  };

  const handleGroupCall = () => {
    const roomId = prompt(
      "Enter a Group Call Room ID (or use current friend room):",
      `room-${contact.id?.slice(-6)}`,
    );
    if (roomId) {
      joinGroupCall(roomId);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/80 h-16 px-4 z-20 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          onClick={() => {
            navigate("/chat");
            toggleSidebar();
          }}
          title="Back to Chats"
        >
          <HiArrowLeft className="text-xl" />
        </button>

        {/* Avatar with Online/Offline Glow */}
        <div
          onClick={() => contact?.id && navigate(`/friends/${contact.id}`)}
          className="relative cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700/60">
            {contact?.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </div>

        {/* User Info */}
        <div
          className="min-w-0 cursor-pointer"
          onClick={() => contact?.id && navigate(`/friends/${contact.id}`)}
        >
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {contact?.name || "Chat"}
          </h2>
          <p className="text-[11px] truncate flex items-center gap-1.5">
            {isTyping ? (
              <span className="text-[#00A1FF] font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce [animation-delay:0.4s]" />
                typing...
              </span>
            ) : isOnline ? (
              <span className="text-emerald-500 dark:text-emerald-400 font-medium">
                Online
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {formatLastSeen(contact?.last_online || contact?.lastSeen)}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons: Voice Call, Video Call, Group Call */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleVoiceCall}
          title="Start Voice Call"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 hover:bg-[#00A1FF]/15 dark:hover:bg-[#00A1FF]/20 text-slate-700 dark:text-slate-300 hover:text-[#00A1FF] dark:hover:text-[#00A1FF] border border-slate-200 dark:border-slate-700/60 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          onClick={handleVideoCall}
          title="Start Video Call"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 hover:bg-[#00A1FF]/15 dark:hover:bg-[#00A1FF]/20 text-slate-700 dark:text-slate-300 hover:text-[#00A1FF] dark:hover:text-[#00A1FF] border border-slate-200 dark:border-slate-700/60 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <Video className="w-4 h-4" />
        </button>

        <button
          onClick={handleGroupCall}
          title="Start or Join Group Call"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800/80 hover:bg-[#00A1FF]/15 dark:hover:bg-[#00A1FF]/20 text-slate-700 dark:text-slate-300 hover:text-[#00A1FF] dark:hover:text-[#00A1FF] border border-slate-200 dark:border-slate-700/60 active:scale-95 transition-all cursor-pointer shadow-sm hidden sm:flex"
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

// Subcomponent: Message Input
const MessageInput = ({ chatId, socket }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!socket || !chatId) return;

    socket.emit("typing:start", { receiverId: chatId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { receiverId: chatId });
    }, 1500);
  };

  const currentUser = useSelector((state) => state.auth.user);

  const handleSendMessage = async () => {
    if (!chatId) return;

    const trimmedText = message.trim();
    if (trimmedText || imageFile) {
      let imageBase64 = null;
      if (imageFile) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }

      const messagePayload = {
        receiver: String(chatId),
        receiverId: String(chatId),
        receiverModel: "user",
        message: trimmedText || "",
      };

      if (imageBase64) {
        messagePayload.image = imageBase64;
      }

      dispatch(sendMessage(messagePayload))
        .then((res) => {
          if (res?.payload?.data) {
            dispatch(
              updateFriendLastMessage({
                friendId: chatId,
                message: res.payload.data,
                isIncoming: false,
                isCurrentChat: true,
              }),
            );
          }
        })
        .catch((err) => {
          console.log("error", err);
        });

      if (socket) {
        socket.emit("typing:stop", { receiverId: chatId });
      }

      setMessage("");
      setImageFile(null);
      setPreviewUrl(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800/80 p-2 sm:p-3 relative z-20 transition-colors duration-200">
      {/* File Attachment Preview */}
      {previewUrl && (
        <div className="mb-2 relative w-fit rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
          <img
            src={previewUrl}
            alt="Selected attachment"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <button
            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full p-1 cursor-pointer transition-colors"
            onClick={() => {
              setImageFile(null);
              setPreviewUrl(null);
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={theme === "dark" ? "dark" : "light"}
                height={350}
                width={300}
              />
            </div>
          )}
        </div>

        {/* Attachment Picker */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
          title="Attach image or video"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Text Input Field */}
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={imageFile ? "Add a caption..." : "Type a message..."}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/70 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#00A1FF] dark:focus:border-[#00A1FF] focus:ring-2 focus:ring-[#00A1FF]/20 transition-all"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!message.trim() && !imageFile}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            message.trim() || imageFile
              ? "bg-[#00A1FF] hover:bg-[#008fe6] text-white shadow-lg shadow-[#00A1FF]/30 active:scale-95"
              : "bg-slate-200 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </footer>
  );
};

// Main ChatScreen Page
const ChatScreen = () => {
  const { socket, onlineUsers } = useSocketContext();
  const { toggleSidebar } = useOutletContext();
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const { messages } = useSelector((state) => state.chat);
  const { user: userProfile } = useSelector((state) => state.userProfile);
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;

  const scrollContainerRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [partnerLastSeen, setPartnerLastSeen] = useState(null);

  // Sync partnerLastSeen with fetched userProfile
  useEffect(() => {
    if (userProfile?.last_online || userProfile?.lastSeen) {
      setPartnerLastSeen(userProfile.last_online || userProfile.lastSeen);
    }
  }, [userProfile]);

  // Listen for real-time last-seen and status-change socket events
  useEffect(() => {
    if (!socket) return;

    const handleUserLastSeen = (data) => {
      if (data?.userId === chatId) {
        setPartnerLastSeen(data.last_online || data.lastSeen || new Date());
      }
    };

    const handleUserStatusChange = (data) => {
      if (data?.userId === chatId) {
        if (data.last_online || data.lastSeen) {
          setPartnerLastSeen(data.last_online || data.lastSeen);
        }
      }
    };

    socket.on("user:last-seen", handleUserLastSeen);
    socket.on("user-status-change", handleUserStatusChange);

    return () => {
      socket.off("user:last-seen", handleUserLastSeen);
      socket.off("user-status-change", handleUserStatusChange);
    };
  }, [socket, chatId]);

  // Track whether this is the initial chat open / switch
  const isInitialChatLoadRef = useRef(true);
  const prevChatIdRef = useRef(chatId);
  const prevMessagesLengthRef = useRef(0);

  // Instant snap to bottom helper (instant, 0ms animation)
  const snapToBottomInstant = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // Fetch initial chat messages and recipient profile
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
      dispatch(fetchUserById(chatId));
    }
  }, [chatId, dispatch]);

  // When switching chats, mark as initial load so it opens directly at bottom
  useEffect(() => {
    if (prevChatIdRef.current !== chatId) {
      prevChatIdRef.current = chatId;
      isInitialChatLoadRef.current = true;
      prevMessagesLengthRef.current = 0;
      setShowScrollButton(false);
      snapToBottomInstant();
    }
  }, [chatId]);

  // Mark messages as read immediately when entering the chat or receiving new messages
  useEffect(() => {
    if (!chatId) return;

    // Reset unread count immediately in sidebar chat list
    dispatch(resetFriendUnreadCount({ friendId: chatId }));

    // Emit mark-read event over socket for instant zero-delay blue tick on sender's screen
    if (socket) {
      socket.emit("messages:mark-read", { senderId: chatId });
    }

    // Optimistically mark messages in Redux store as read
    dispatch(
      markAllMessagesAsRead({
        readerId: currentUserId,
        readAt: new Date().toISOString(),
      }),
    );
  }, [chatId, socket, messages.length, dispatch, currentUserId]);

  // Listen for partner typing indicator
  useEffect(() => {
    if (!socket || !chatId) return;

    const onTypingStart = ({ senderId }) => {
      if (senderId === chatId) setIsPartnerTyping(true);
    };
    const onTypingStop = ({ senderId }) => {
      if (senderId === chatId) setIsPartnerTyping(false);
    };

    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    return () => {
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
    };
  }, [socket, chatId]);

  // Layout effect: instantly position viewport at latest message BEFORE browser paint
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isInitialChatLoadRef.current) {
      snapToBottomInstant();

      if (messages && messages.length > 0) {
        // Ensure layout stabilization across animation frames without visible scrolling
        requestAnimationFrame(snapToBottomInstant);
        const timer1 = setTimeout(snapToBottomInstant, 30);
        const timer2 = setTimeout(snapToBottomInstant, 100);

        isInitialChatLoadRef.current = false;
        prevMessagesLengthRef.current = messages.length;

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [chatId, messages]);

  // Smooth scroll for subsequent new messages or typing indicator while actively chatting
  useEffect(() => {
    if (isInitialChatLoadRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const hasNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (hasNewMessage) {
      const lastMsg = messages[messages.length - 1];
      const senderId = lastMsg?.sender?._id || lastMsg?.sender;
      const isMyMessage = String(senderId) === String(currentUserId);

      const isNearBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 160;

      if (isMyMessage || isNearBottom) {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setShowScrollButton(true);
      }
    } else if (isPartnerTyping) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 160;
      if (isNearBottom) {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isPartnerTyping, currentUserId]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isInitialChatLoadRef.current) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 120);
  };

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const isOnline = useMemo(() => {
    return Array.isArray(onlineUsers) && onlineUsers.includes(chatId);
  }, [onlineUsers, chatId]);

  const contact = userProfile
    ? {
        id: userProfile._id,
        name: userProfile.name,
        avatar: userProfile.profile_pic?.url,
        last_online:
          partnerLastSeen || userProfile.last_online || userProfile.lastSeen,
        lastSeen:
          partnerLastSeen || userProfile.last_online || userProfile.lastSeen,
      }
    : {
        id: chatId,
        name: "Chat",
        avatar: null,
        last_online: partnerLastSeen,
        lastSeen: partnerLastSeen,
      };

  return (
    <div className="flex flex-col h-full w-full relative bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Chat Top Header */}
      <ChatHeader
        toggleSidebar={toggleSidebar}
        contact={contact}
        isOnline={isOnline}
        isTyping={isPartnerTyping}
      />

      {/* Messages Scroll Area with Telegram/WhatsApp-grade Chat Canvas Wallpaper */}
      <div
        className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 customScrollbar chat-canvas-bg relative"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        <div className="max-w-3xl mx-auto flex flex-col min-h-full">
          {/* Top flexible spacer: pushes few messages to bottom, collapses when messages scroll */}
          <div className="flex-1 min-h-0" />

          {/* Empty Conversation Welcome State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-[#00A1FF]/10 dark:bg-[#00A1FF]/15 border border-[#00A1FF]/30 p-2.5 mb-3.5 shadow-lg shadow-[#00A1FF]/15 flex items-center justify-center">
                <img
                  src="/icon.png"
                  alt="Logo"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                {contact?.name || "Chat"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-4">
                Send a message to start chatting. Photos, videos, and emojis are
                supported!
              </p>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Lock size={12} className="text-[#00A1FF]" />
                <span>End-to-end messaging enabled</span>
              </span>
            </div>
          )}

          {/* Messages List */}
          <div className="flex flex-col space-y-1">
            {messages.map((msg, idx) => {
              const currentDate = new Date(msg.createdAt).toDateString();
              const prevDate =
                idx > 0
                  ? new Date(messages[idx - 1].createdAt).toDateString()
                  : null;
              const showDate = currentDate !== prevDate;

              const senderId = msg?.sender?._id || msg?.sender;
              const isSender = String(senderId) === String(currentUserId);

              return (
                <div key={msg._id || idx}>
                  <MessageBubble
                    message={msg}
                    isSender={isSender}
                    showDate={showDate}
                  />
                </div>
              );
            })}
          </div>

          {/* Partner Typing Bubble */}
          {isPartnerTyping && (
            <div className="flex items-center gap-2 my-2 px-2 sm:px-4 animate-in fade-in">
              <div className="p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/60 text-xs text-[#00A1FF] flex items-center gap-1.5 shadow-sm dark:shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A1FF] animate-bounce [animation-delay:0.4s]" />
                <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">
                  typing...
                </span>
              </div>
            </div>
          )}

          {/* Dedicated Bottom Scroll Anchor */}
          <div ref={lastMessageRef} className="h-0 w-full shrink-0" />
        </div>
      </div>

      {/* Scroll to Bottom Floating Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-5 bg-[#00A1FF] hover:bg-[#008fe6] text-white p-2.5 rounded-full shadow-xl shadow-[#00A1FF]/30 transition-all duration-200 cursor-pointer active:scale-95 z-30 border border-white/20 dark:border-[#00A1FF]/40"
          title="Scroll to latest"
        >
          <ChevronsDown size={18} />
        </button>
      )}

      {/* Message Input Bar */}
      <MessageInput chatId={chatId} socket={socket} />
    </div>
  );
};

export default ChatScreen;
