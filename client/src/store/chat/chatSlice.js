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
    async (messageData, { rejectWithValue }) => {
        try {
            console.log("messageData", messageData);
            const response = await axiosInstance.post(
                `/message/send-message`,
                messageData
            );

            // console.log("response "  , response);

            return response.data;
        } catch (error) {
            // console.log("error " , error);

            return rejectWithValue(error.response.data);
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
        addMessage: (state, action) => {
            const isPresent = state.messages.find(
                (item) => item._id === action.payload._id
            );

            const updateData = [...state.messages];
            if (!isPresent) {
                updateData.push(action.payload);
            }
            state.messages = updateData;
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
            const deleted = action.payload;
            const index = state.messages.findIndex(
                (msg) => msg._id === deleted._id
            );
            if (index !== -1) {
                state.messages[index] = deleted;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
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
                    state.messages = []; // Fallback safety
                }
                state.loading = false;
                state.messages.push(action.payload?.data);
            });
    },
});

export const {
    updateMessage,
    reactedMessage,
    deletedMessage,
    addMessage,
    deletedReaction,
    clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
