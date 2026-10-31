import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { fetchChaListFriends } from "../store/chatList/chatAction";
import {
    addMessage,
    updateMessageStatus,
    markAllMessagesAsRead,
    markMessagesDeliveredBulk,
} from "../store/chat/chatSlice";
import {
    updateFriendLastMessage,
    updateFriendReadReceipt,
} from "../store/chatList/chatListSlice";
import { notificationService } from "../utils/notification";

const SocketContext = createContext({
    socket: null,
    onlineUsers: [],
    isConnected: false,
});

export const SocketContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const SOCKET_URL = import.meta.env.VITE_BACKEND_BASE_URI || "http://localhost:5000";

    useEffect(() => {
        const currentUserId = user?._id || user?.id || user?.data?._id;
        if (!currentUserId) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");

        const socketClient = io(SOCKET_URL, {
            query: {
                userId: currentUserId,
            },
            auth: {
                token,
                userId: currentUserId,
            },
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        socketClient.on("connect", () => {
            console.log("⚡ Socket connected with ID:", socketClient.id);
            setIsConnected(true);
        });

        socketClient.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
            setIsConnected(false);
        });

        socketClient.on("onlineUsers", (users) => {
            setOnlineUsers(users);
        });

        // Incoming message
        socketClient.on("send-message", ({ receiverId, chat }) => {
            dispatch(addMessage(chat));
            notificationService.playReceiveSound();

            const senderId = chat?.sender?._id || chat?.sender;
            const currentPath = window.location.pathname;
            const isViewingThisChat = currentPath === `/chat/${senderId}`;

            // Update friend last message, increment unread count if not viewing, and move to top immediately
            dispatch(
                updateFriendLastMessage({
                    friendId: senderId,
                    message: chat,
                    isIncoming: true,
                    isCurrentChat: isViewingThisChat,
                })
            );

            // Push Notification
            const senderName = chat?.sender?.name || "New Message";
            const text = chat?.message || (chat?.type === "image" ? "📷 Image" : "Sent a message");
            notificationService.showNotification(`New message from ${senderName}`, {
                body: text,
                icon: chat?.sender?.profile_pic?.url || "/icon.png",
            });
        });

        // Sent message acknowledgement (e.g. from other session or sync)
        socketClient.on("meg-sent", ({ sender, chat }) => {
            const recipientId = chat?.receiver?._id || chat?.receiver;
            dispatch(
                updateFriendLastMessage({
                    friendId: recipientId,
                    message: chat,
                    isIncoming: false,
                    isCurrentChat: true,
                })
            );
        });

        // Message status updates
        socketClient.on("message:status-update", (data) => {
            dispatch(updateMessageStatus(data));
        });

        socketClient.on("messages:delivered", (data) => {
            dispatch(markMessagesDeliveredBulk(data));
        });

        socketClient.on("messages:read", (data) => {
            dispatch(markAllMessagesAsRead(data));
            dispatch(updateFriendReadReceipt(data));
        });

        // Friend request updates
        socketClient.on("friendRequest", ({ senderName }) => {
            dispatch(fetchChaListFriends());
            notificationService.playReceiveSound();
            notificationService.showNotification("Friend Request", {
                body: `${senderName} sent you a friend request`,
            });
        });

        socketClient.on("manageSendFriendReq", ({ senderName, action }) => {
            dispatch(fetchChaListFriends());
            notificationService.showNotification("Friend Request Update", {
                body: `${senderName} ${action === "accept" ? "accepted" : "declined"} your friend request`,
            });
        });

        socketClient.on("cancelFriendRequest", () => {
            dispatch(fetchChaListFriends());
        });

        socketClient.on("unfriend", () => {
            dispatch(fetchChaListFriends());
        });

        setSocket(socketClient);

        return () => {
            socketClient.disconnect();
        };
    }, [user?._id, dispatch, SOCKET_URL]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    return useContext(SocketContext);
};
