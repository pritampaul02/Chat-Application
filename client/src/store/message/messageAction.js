import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";

// Thunks
export const editMessage = createAsyncThunk(
    "message/edit",
    async ({ messageId, message }, { rejectWithValue }) => {
        console.log(messageId, message, "all message");
        try {
            const res = await axiosInstance.patch(
                `/message/edit/${messageId}`,
                { message }
            );
            console.log(res);
            return res.data.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const deleteMessage = createAsyncThunk(
    "message/delete",
    async (messageId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/message/${messageId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const reactToMessage = createAsyncThunk(
    "message/react",
    async ({ messageId, emoji }, { rejectWithValue }) => {
        console.log(messageId, emoji, "emoji");
        try {
            const res = await axiosInstance.patch(
                `/message/edit/react/${messageId}`,
                {
                    emoji,
                }
            );
            console.log(res, "reacted message");
            return res.data.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const deleteReactToMessage = createAsyncThunk(
    "message/deleteReact",
    async ({ messageId, emoji }, { rejectWithValue }) => {
        try {
            console.log(messageId, emoji, "delete emoji");
            const res = await axiosInstance.delete(
                `/message/delete/react/${messageId}`,
                { data: { emoji } }
            );
            return res.data.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response.data.message);
        }
    }
);
