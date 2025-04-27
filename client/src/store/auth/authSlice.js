import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// REGISTER THUNK
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                "https://chat-application-vzlq.vercel.app/api/v1/user/register",
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
                "https://chat-application-vzlq.vercel.app/api/v1/user/login",
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
                "https://chat-application-vzlq.vercel.app/api/v1/user/logout",
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
                "https://chat-application-vzlq.vercel.app/api/v1/user/me", // API endpoint to get current user
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

// AUTH SLICE
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
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
                state.user = action.payload;
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
                state.user = action.payload;
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
            })
            .addCase(logOutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Load Current User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
            });
    },
});

export const { clearError, logoutUser } = authSlice.actions;
export default authSlice.reducer;
