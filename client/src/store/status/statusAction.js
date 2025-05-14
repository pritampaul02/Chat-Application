import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import axios from "axios";

export const fetchStatuses = createAsyncThunk(
    "status/fetchStatuses",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/status/");
            // console.log("status res", res);
            return res.data.data; // adjust based on your API response
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || "Failed to search users"
            );
        }
    }
);

export const likeStatus = createAsyncThunk(
    "status/likeStatus",
    async (statusId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/status/like/${statusId}`);
            return res.data.status; // adjust based on your API response
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || "Failed to like status"
            );
        }
    }
);

export const viewStatus = createAsyncThunk(
    "status/viewStatus",
    async (statusId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/status/view/${statusId}`);

            return res.data.data; // adjust based on your API response
        } catch (err) {
            console.log("view status error", err);
            return rejectWithValue(
                err.response?.data?.error || "Failed to view status"
            );
        }
    }
);

export const deleteStatus = createAsyncThunk(
    "status/deleteStatus",
    async (statusId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(
                `/status/delete/${statusId}`
            );
            return res.data.status; // adjust based on your API response
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.error || "Failed to delete status"
            );
        }
    }
);

export const createTextStatus = createAsyncThunk(
    "status/createText",
    async (payload, { rejectWithValue }) => {
        console.log("payload", payload);
        try {
            const { data } = await axiosInstance.post("/status/", payload);
            console.log("status res", data);
            return data;
        } catch (err) {
            console.log("status error", err);
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const createImageStatus = createAsyncThunk(
    "status/createImage",
    async (formData, { rejectWithValue }) => {
        try {
            console.log("formData", formData);
            const { data } = await axiosInstance.post(
                "/status/",
                { formData },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (err) {
            console.log("status error", err);
            return rejectWithValue(err.response.data.message);
        }
    }
);

export const createPollStatus = createAsyncThunk(
    "status/createPoll",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post("/status/", payload);
            return data;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
);
