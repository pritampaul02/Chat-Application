import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axios";
import axios from "axios";

// REGISTER THUNK
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `/user/register`,
                formData
            );
            if (data?.success && data?.token) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("myUser", JSON.stringify(data.data));
            }
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

// LOGIN THUNK
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/user/login`, formData);

            if (data?.success && data?.token) {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("myUser", JSON.stringify(data.data));
            }

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);
// LOGOUT THUNK
export const logOutUser = createAsyncThunk(
    "auth/logOutUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/user/logout`);
            sessionStorage.removeItem("myUser");
            sessionStorage.removeItem("token");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

// Fetch Current User Thunk (for session persist after refresh)
// Updated loadUser thunk with proper cookie handling
export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            // console.log("api calling me");
            const user = sessionStorage.getItem("myUser");
            const token = sessionStorage.getItem("token");

            if (user && token) {
                return {
                    ...JSON.parse(user),
                    token,
                };
            }
            const { data } = await axiosInstance.get(
                `/user/me` // API endpoint to get current user
            );
            sessionStorage.setItem("myUser", JSON.stringify(data));
            return data; // Return the user data
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to load user"
            );
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, { rejectWithValue }) => {
        try {
            // console.log("api calling me");

            const { data } = await axiosInstance.get(
                `/user/me` // API endpoint to get current user
            );

            return data; // Return the user data
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to load user"
            );
        }
    }
);

// edit profile

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData, { rejectWithValue }) => {
        console.log("api is updating");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const res = await axios.patch(
                `${
                    import.meta.env.VITE_BACKEND_BASE_URI
                }/api/v1/user/update-all-my-profile`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response?.data?.message);
        }
    }
);
