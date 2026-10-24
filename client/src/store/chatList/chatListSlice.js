import { createSlice } from "@reduxjs/toolkit";
import { fetchChaListFriends } from "./chatAction";

const initialState = {
    loading: false,
    error: null,
    success: null,
    message: null,
    user: {},
    fetchChaListFriends: false,
};

const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        clearChatListState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
            state.message = null;
            state.user = null;
            state.fetchChaListFriends = false;
        },

        // Update friend last message and move friend to the very top of the list
        updateFriendLastMessage: (state, action) => {
            const { friendId, message, isIncoming, isCurrentChat } = action.payload || {};
            if (!state.user || !Array.isArray(state.user.friends) || !friendId) return;

            const friendIndex = state.user.friends.findIndex(
                (f) => String(f._id) === String(friendId)
            );

            if (friendIndex !== -1) {
                const friend = { ...state.user.friends[friendIndex] };
                const msg = message || {};

                friend.lastMessage = {
                    _id: msg._id,
                    sender: msg.sender?._id || msg.sender,
                    receiver: msg.receiver?._id || msg.receiver,
                    type: isIncoming ? "receiver" : "sender",
                    isRead: isIncoming ? (isCurrentChat ? true : false) : false,
                    status: msg.status || (isIncoming ? "delivered" : "sent"),
                    createdAt: msg.createdAt || new Date().toISOString(),
                    editedAt: msg.editedAt,
                    message:
                        msg.message ||
                        (msg.type === "image" || msg.image || msg.media ? "📷 Media" : ""),
                };

                if (isIncoming) {
                    if (!isCurrentChat) {
                        const currentCount = Number(friend.unreadCount || friend.msgNotification || 0);
                        friend.unreadCount = currentCount + 1;
                        friend.msgNotification = friend.unreadCount;
                    } else {
                        friend.unreadCount = 0;
                        friend.msgNotification = 0;
                    }
                }

                // Move friend to index 0 (top of chat list)
                const otherFriends = state.user.friends.filter((_, idx) => idx !== friendIndex);
                state.user.friends = [friend, ...otherFriends];
            }
        },

        // Reset unread count when user enters or reads messages in a chat
        resetFriendUnreadCount: (state, action) => {
            const { friendId } = action.payload || {};
            if (!state.user || !Array.isArray(state.user.friends) || !friendId) return;

            const friend = state.user.friends.find(
                (f) => String(f._id) === String(friendId)
            );

            if (friend) {
                friend.unreadCount = 0;
                friend.msgNotification = 0;
                if (friend.lastMessage) {
                    friend.lastMessage.isRead = true;
                }
            }
        },

        // Update read receipt when the other party reads our messages
        updateFriendReadReceipt: (state, action) => {
            const { readerId } = action.payload || {};
            if (!state.user || !Array.isArray(state.user.friends) || !readerId) return;

            const friend = state.user.friends.find(
                (f) => String(f._id) === String(readerId)
            );

            if (friend && friend.lastMessage?.type === "sender") {
                friend.lastMessage.isRead = true;
                friend.lastMessage.status = "read";
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChaListFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload || "User fetched successfully";
                state.user = action.payload;
                state.fetchChaListFriends = true;
            })
            .addCase(fetchChaListFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get user";
                state.fetchChaListFriends = false;
            })
            // Automatically move friend to top when current user sends a message
            .addCase("chat/sendMessage/fulfilled", (state, action) => {
                const chat = action.payload?.data;
                if (!chat || !state.user?.friends || !Array.isArray(state.user.friends)) return;
                const receiverId = chat.receiver?._id || chat.receiver;
                const friendIndex = state.user.friends.findIndex(
                    (f) => String(f._id) === String(receiverId)
                );

                if (friendIndex !== -1) {
                    const friend = { ...state.user.friends[friendIndex] };
                    friend.lastMessage = {
                        _id: chat._id,
                        sender: chat.sender?._id || chat.sender,
                        receiver: receiverId,
                        type: "sender",
                        isRead: false,
                        status: chat.status || "sent",
                        createdAt: chat.createdAt || new Date().toISOString(),
                        editedAt: chat.editedAt,
                        message:
                            chat.message ||
                            (chat.media || chat.image ? "📷 Media" : ""),
                    };
                    const otherFriends = state.user.friends.filter(
                        (_, idx) => idx !== friendIndex
                    );
                    state.user.friends = [friend, ...otherFriends];
                }
            });
    },
});

export const {
    clearChatListState,
    updateFriendLastMessage,
    resetFriendUnreadCount,
    updateFriendReadReceipt,
} = chatListSlice.actions;

export default chatListSlice.reducer;
