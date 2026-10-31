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

const SOCKET_URL = String(
    import.meta.env.VITE_BACKEND_BASE_URI || "http://localhost:5000"
).trim().replace(/\/+$/, "");

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

    const socketRef = useRef(null);
    const activeUserIdRef = useRef(null);

    const currentUserId = user?._id || user?.id || user?.data?._id;

    useEffect(() => {
        if (!currentUserId) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            activeUserIdRef.current = null;
            return;
        }

        // If a socket is already active for this exact user, do not recreate!
        if (
            socketRef.current &&
            activeUserIdRef.current === currentUserId &&
            (socketRef.current.connected || socketRef.current.connecting)
        ) {
            return;
        }

        // If switching user, disconnect the previous socket
        if (socketRef.current && activeUserIdRef.current !== currentUserId) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        activeUserIdRef.current = currentUserId;

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
            upgrade: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        socketRef.current = socketClient;
        setSocket(socketClient);

        socketClient.on("connect", () => {
            console.log("⚡ Socket connected with ID:", socketClient.id);
            setIsConnected(true);
        });

        socketClient.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
            setIsConnected(false);
            // If the disconnect was triggered by server or transport drop, auto-reconnect
            if (reason === "io server disconnect" || reason === "transport close") {
                socketClient.connect();
            }
        });

        socketClient.on("connect_error", (error) => {
            console.warn("⚠️ Socket connection error:", error.message);
        });

        socketClient.on("onlineUsers", (users) => {
            setOnlineUsers(users);
        });

        // Keep-alive heartbeat every 15s to prevent cloud proxy (Render/Vercel) idle disconnects
        const heartbeatInterval = setInterval(() => {
            if (socketClient && socketClient.connected) {
                socketClient.emit("heartbeat");
            }
        }, 15000);

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

        return () => {
            clearInterval(heartbeatInterval);
        };
    }, [currentUserId, dispatch]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    return useContext(SocketContext);
};
