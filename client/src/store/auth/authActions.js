import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REGISTER THUNK
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URI}/api/v1/user/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
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
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URI}/api/v1/user/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
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
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_BASE_URI}/api/v1/user/logout`,
                {
                    withCredentials: true,
                }
            );
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
            console.log("api calling me");
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_BASE_URI}/api/v1/user/me`, // API endpoint to get current user
                { withCredentials: true } // Make sure cookies are included
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
