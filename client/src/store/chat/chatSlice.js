import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async (receiverId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/message/${receiverId}`);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (message, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/message/send-message",
                message
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;

                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                if (!Array.isArray(state.messages)) {
                    state.messages = []; // Fallback safety
                }
                state.messages.push(action.payload);
            });
    },
});

export default chatSlice.reducer;
