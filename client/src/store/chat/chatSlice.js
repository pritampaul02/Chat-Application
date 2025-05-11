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
            const response = await axiosInstance.post(
                `/message/send-message`,
                messageData
            );
            return response.data;
        } catch (error) {
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
            state.messages.push(action.payload);
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
                console.log(
                    "Message sent successfully:",
                    action.payload?.data.message
                );
                state.messages.push(action.payload?.data);
            });
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
