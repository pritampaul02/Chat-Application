import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import axiosInstance from "../../utils/axios";

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/message/${chatId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (messagePayload, { rejectWithValue }) => {
        try {
            let requestData = messagePayload;
            let tempId = null;

            if (messagePayload && messagePayload.payload) {
                requestData = messagePayload.payload;
                tempId = messagePayload.tempId;
            } else if (messagePayload instanceof FormData) {
                tempId = messagePayload.get("tempId");
            } else if (messagePayload && typeof messagePayload === "object") {
                tempId = messagePayload.tempId;
            }

            const response = await axiosInstance.post(
                `/message/send-message`,
                requestData
            );

            return {
                ...response.data,
                tempId,
            };
        } catch (error) {
            return rejectWithValue({
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to send message",
                tempId:
                    (messagePayload && messagePayload.tempId) ||
                    (messagePayload instanceof FormData &&
                        messagePayload.get("tempId")) ||
                    null,
            });
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        optimisticSendMessage: (state, action) => {
            const optimisticMsg = action.payload;
            if (!Array.isArray(state.messages)) state.messages = [];
            state.messages.push(optimisticMsg);
        },

        replaceOptimisticMessage: (state, action) => {
            const { tempId, realMessage } = action.payload || {};
            if (!tempId || !realMessage) return;
            const index = state.messages.findIndex(
                (m) => m.tempId === tempId || m._id === tempId
            );
            if (index !== -1) {
                state.messages[index] = realMessage;
            } else if (!state.messages.some((m) => m._id === realMessage._id)) {
                state.messages.push(realMessage);
            }
        },

        markMessageFailed: (state, action) => {
            const { tempId, _id } = action.payload || {};
            const msg = state.messages.find(
                (m) =>
                    (tempId && (m.tempId === tempId || m._id === tempId)) ||
                    (_id && m._id === _id)
            );
            if (msg) {
                msg.status = "failed";
            }
        },

        addMessage: (state, action) => {
            const newMsg = action.payload;
            if (!newMsg) return;
            if (!Array.isArray(state.messages)) state.messages = [];

            // Check if matching optimistic message by tempId
            if (newMsg.tempId) {
                const optIndex = state.messages.findIndex(
                    (m) => m.tempId === newMsg.tempId || m._id === newMsg.tempId
                );
                if (optIndex !== -1) {
                    state.messages[optIndex] = newMsg;
                    return;
                }
            }

            // Check if already present by _id
            const exists = state.messages.some((m) => m._id === newMsg._id);
            if (!exists) {
                state.messages.push(newMsg);
            }
        },

        updateMessage: (state, action) => {
            const updated = action.payload;
            const index = state.messages.findIndex(
                (msg) => msg._id === updated._id
            );
            if (index !== -1) {
                state.messages[index] = updated;
            }
        },

        deletedMessage: (state, action) => {
            const deleted = action.payload;
            const index = state.messages.findIndex(
                (msg) => msg._id === deleted._id
            );
            if (index !== -1) {
                state.messages[index] = deleted;
            }
        },

        reactedMessage: (state, action) => {
            const updated = action.payload;
            const index = state.messages.findIndex(
                (msg) => msg._id === updated._id
            );
            if (index !== -1) {
                state.messages[index] = updated;
            }
        },

        deletedReaction: (state, action) => {
            const updated = action.payload;
            const index = state.messages.findIndex(
                (msg) => msg._id === updated._id
            );
            if (index !== -1) {
                state.messages[index] = updated;
            }
        },

        updateMessageStatus: (state, action) => {
            const { messageId, tempId, status, deliveredAt, readAt } =
                action.payload || {};
            const msg = state.messages.find(
                (m) =>
                    (messageId && m._id === messageId) ||
                    (tempId && (m.tempId === tempId || m._id === tempId))
            );
            if (msg) {
                msg.status = status;
                if (deliveredAt) {
                    msg.deliveredAt =
                        typeof deliveredAt === "object" &&
                        typeof deliveredAt?.toISOString === "function"
                            ? deliveredAt.toISOString()
                            : String(deliveredAt);
                }
                if (readAt) {
                    msg.readAt =
                        typeof readAt === "object" &&
                        typeof readAt?.toISOString === "function"
                            ? readAt.toISOString()
                            : String(readAt);
                    msg.isRead = true;
                }
            }
        },

        markAllMessagesAsRead: (state, action) => {
            const { readerId, readAt } = action.payload || {};
            const isoReadAt = readAt
                ? typeof readAt === "object" &&
                  typeof readAt?.toISOString === "function"
                    ? readAt.toISOString()
                    : String(readAt)
                : new Date().toISOString();

            state.messages.forEach((msg) => {
                const receiverId = msg.receiver?._id || msg.receiver;
                if (String(receiverId) === String(readerId) || !readerId) {
                    msg.status = "read";
                    msg.isRead = true;
                    msg.readAt = isoReadAt;
                }
            });
        },

        markMessagesDeliveredBulk: (state, action) => {
            const { messageIds, deliveredAt } = action.payload || {};
            const isoDeliveredAt = deliveredAt
                ? typeof deliveredAt === "object" &&
                  typeof deliveredAt?.toISOString === "function"
                    ? deliveredAt.toISOString()
                    : String(deliveredAt)
                : new Date().toISOString();

            const idsSet = new Set((messageIds || []).map(String));
            state.messages.forEach((msg) => {
                if (idsSet.has(String(msg._id)) && msg.status === "sent") {
                    msg.status = "delivered";
                    msg.deliveredAt = isoDeliveredAt;
                }
            });
        },

        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.messages = [];
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = Array.isArray(action.payload?.data)
                    ? action.payload?.data
                    : [];
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                if (!Array.isArray(state.messages)) {
                    state.messages = [];
                }
                state.loading = false;
                const realMsg = action.payload?.data;
                const tempId = action.payload?.tempId || realMsg?.tempId;

                if (realMsg) {
                    if (tempId) {
                        const optIndex = state.messages.findIndex(
                            (m) => m.tempId === tempId || m._id === tempId
                        );
                        if (optIndex !== -1) {
                            state.messages[optIndex] = realMsg;
                            return;
                        }
                    }
                    if (!state.messages.some((m) => m._id === realMsg._id)) {
                        state.messages.push(realMsg);
                    }
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                const tempId = action.payload?.tempId;
                if (tempId) {
                    const msg = state.messages.find(
                        (m) => m.tempId === tempId || m._id === tempId
                    );
                    if (msg) {
                        msg.status = "failed";
                    }
                }
                state.error = action.payload?.message || "Failed to send";
            });
    },
});

export const {
    optimisticSendMessage,
    replaceOptimisticMessage,
    markMessageFailed,
    updateMessage,
    reactedMessage,
    deletedMessage,
    deletedReaction,
    addMessage,
    updateMessageStatus,
    markAllMessagesAsRead,
    markMessagesDeliveredBulk,
    clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;

