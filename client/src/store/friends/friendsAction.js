import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axios";

export const sendFriendRequest = createAsyncThunk(
    "friends/sendFriendRequest",
    async (requestId, { rejectWithValue }) => {
        console.log("requestId", requestId);
        try {
            const { data } = await axiosInstance.post(
                `/user/send-friend-requast`,
                { requestId }
            );
            return data.message;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(
                error.response?.data?.message || "Error sending request"
            );
        }
    }
);

export const cancelFriendRequest = createAsyncThunk(
    "friends/cancelFriendRequest",
    async (requestId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `/user/cancel-friend-request`,
                {
                    requestId,
                }
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Cancel request failed"
            );
        }
    }
);

export const manageFriendRequest = createAsyncThunk(
    "friends/manageFriendRequest",
    async (friendData, { rejectWithValue }) => {
        try {
            console.log(friendData);
            const { data } = await axiosInstance.post(
                `/user/manage-friend-requast`,

                friendData
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Cancel request failed"
            );
        }
    }
);
