import { createSlice } from "@reduxjs/toolkit";
import {
    registerUser,
    loginUser,
    logOutUser,
    loadUser,
} from "./authActions.js";

const initialState = {
    user: {},
    loading: {
        registerUser: false,
        loginUser: false,
        logOutUser: false,
        loadUser: false,
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
                state.loading.registerUser = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading.registerUser = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading.registerUser = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading.loginUser = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading.loginUser = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.loginUser = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logOutUser.pending, (state) => {
                state.loading.logOutUser = true;
                state.error = null;
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.loading.logOutUser = false;
                state.user = null;
            })
            .addCase(logOutUser.rejected, (state, action) => {
                state.loading.logOutUser = false;
                state.error = action.payload;
            })

            // Load Current User
            .addCase(loadUser.pending, (state) => {
                state.loading.loadUser = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading.loadUser = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading.loadUser = false;
                state.user = null;
            });
    },
});

export const { clearError, logoutUser } = authSlice.actions;
export default authSlice.reducer;
