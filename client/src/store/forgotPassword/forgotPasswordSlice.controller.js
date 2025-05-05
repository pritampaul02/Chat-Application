import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axios";

// SEND RESET OTP THUNK
export const sendResetOtp = createAsyncThunk(
    "forgotPassword/sendResetOtp",
    async (email, { rejectWithValue }) => {
        try {
            // console.log("api for send otp");
            const { data } = await axiosInstance.post(`/user/forgot-password`, {
                email,
            });
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
            const { data } = await axiosInstance.post(`/user/reset-password`, {
                otp,
                email,
                password,
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to reset password"
            );
        }
    }
);
