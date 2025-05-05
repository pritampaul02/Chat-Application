import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axios";

export const fetchChaListFriends = createAsyncThunk(
    "chatList/fetchChaListFriends",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/user`);

            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    }
);
