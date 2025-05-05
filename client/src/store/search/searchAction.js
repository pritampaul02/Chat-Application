import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axios";

export const fetchUsers = createAsyncThunk(
    "search/fetchUsers",
    async (_, { getState, rejectWithValue }) => {
        const { query, skip, limit } = getState().search;
        try {
            const res = await axiosInstance.get(`/user/search-user`, {
                params: { query: String(query), skip, limit },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || "Failed to search users"
            );
        }
    }
);
