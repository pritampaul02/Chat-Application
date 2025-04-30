import { createSlice } from "@reduxjs/toolkit";
import { sendResetOtp, resetPassword } from "./forgotPasswordSlice.controller";

const initialState = {
    loading: {
        sendResetOtp: false,
        resetPassword: false,
    },
    error: null,
    success: null,
    message: null,
    otpSent: false,
    passwordReset: false,
};

const forgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState,
    reducers: {
        clearForgotPasswordState: (state) => {
            state.loading = {
                sendResetOtp: false,
                resetPassword: false,
            };
            state.error = null;
            state.success = null;
            state.message = null;
            state.otpSent = false;
            state.passwordReset = false;
        },
    },
    extraReducers: (builder) => {
        // --- Send OTP ---
        builder
            .addCase(sendResetOtp.pending, (state) => {
                state.loading.sendResetOtp = true;
                state.error = null;
                state.success = null;
                state.message = null;
                state.otpSent = false;
            })
            .addCase(sendResetOtp.fulfilled, (state, action) => {
                state.loading.sendResetOtp = false;
                state.success = true;
                state.message = action.payload?.message || "OTP sent";
                state.otpSent = true;
            })
            .addCase(sendResetOtp.rejected, (state, action) => {
                state.loading.sendResetOtp = false;
                state.error = action.payload || "Failed to send OTP";
                state.otpSent = false;
            });

        // --- Reset Password ---
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading.resetPassword = true;
                state.error = null;
                state.success = null;
                state.passwordReset = false;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading.resetPassword = false;
                state.success = true;
                state.message =
                    action.payload?.message || "Password reset successfully";
                state.passwordReset = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading.resetPassword = false;
                state.error = action.payload || "Failed to reset password";
                state.passwordReset = false;
            });
    },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
