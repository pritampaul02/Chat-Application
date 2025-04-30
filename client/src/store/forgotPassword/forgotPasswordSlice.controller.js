import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// SEND RESET OTP THUNK
export const sendResetOtp = createAsyncThunk(
    "forgotPassword/sendResetOtp",
    async (email, { rejectWithValue }) => {
        try {
            console.log("api for send otp");
            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_BASE_URI
                }/api/v1/user/forgot-password`,
                { email },
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
                error.response?.data?.message || "Failed to send OTP"
            );
        }
    }
);

// RESET PASSWORD THUNK
export const resetPassword = createAsyncThunk(
    "forgotPassword/resetPassword",
    async ({ otp, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_BASE_URI
                }/api/v1/user/reset-password`,
                { otp, email, password },
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
                error.response?.data?.message || "Failed to reset password"
            );
        }
    }
);
