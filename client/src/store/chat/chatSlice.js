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
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      console.log("Sending message object payload:", messageData);
      const response = await axiosInstance.post(
        `/message/send-message`,
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return rejectWithValue(
        error.response?.data || { message: error.message },
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const newMsg = action.payload;
      if (!newMsg) return;
      if (!Array.isArray(state.messages)) state.messages = [];

      // Check if already present by _id
      const exists = state.messages.some((m) => m._id === newMsg._id);
      if (!exists) {
        state.messages.push(newMsg);
      }
    },

    updateMessage: (state, action) => {
      const updated = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === updated._id);
      if (index !== -1) {
        state.messages[index] = updated;
      }
    },

    deletedMessage: (state, action) => {
      const deleted = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === deleted._id);
      if (index !== -1) {
        state.messages[index] = deleted;
      }
    },

    reactedMessage: (state, action) => {
      const updated = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === updated._id);
      if (index !== -1) {
        state.messages[index] = updated;
      }
    },

    deletedReaction: (state, action) => {
      const updated = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === updated._id);
      if (index !== -1) {
        state.messages[index] = updated;
      }
    },

    updateMessageStatus: (state, action) => {
      const { messageId, status, deliveredAt, readAt } = action.payload || {};
      const msg = state.messages.find((m) => messageId && m._id === messageId);
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
        const newMsg = action.payload?.data;
        if (newMsg && !state.messages.some((m) => m._id === newMsg._id)) {
          state.messages.push(newMsg);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send message";
      });
  },
});

export const {
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
