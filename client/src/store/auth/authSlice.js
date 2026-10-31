import { createSlice } from "@reduxjs/toolkit";
import {
    registerUser,
    loginUser,
    logOutUser,
    loadUser,
    getMe,
    updateProfile,
} from "./authActions.js";

const initialState = {
    user: {},

    loading: {
        registerUser: false,
        loginUser: false,
        logOutUser: false,
        loadUser: false,
        getMe: false,
        getAllUser: false,
        updateProfile: false,
    },
    isAuthenticated: false,

    error: null,
};
// AUTH SLICE
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logoutUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data || action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data || action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logOutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logOutUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // Load Current User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data || action.payload;
                state.isAuthenticated = !!(state.user?._id || state.user?.id);
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            // get me to get current user current information
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.data || action.payload;
                state.isAuthenticated = !!(state.user?._id || state.user?.id);
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // edit  my profile

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logoutUser } = authSlice.actions;
export default authSlice.reducer;
