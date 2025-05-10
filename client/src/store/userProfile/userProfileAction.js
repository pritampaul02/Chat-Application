import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axios";

// Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
    "userProfile/fetchUserById",
    async (userId, { rejectWithValue }) => {
        try {
            // console.log(userId);
            const { data } = await axiosInstance.get(`/user/${userId}`);

            return data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || "Failed to search users"
            );
        }
    }
);
