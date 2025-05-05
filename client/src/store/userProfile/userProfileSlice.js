// store/userProfile/userProfileSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { fetchUserById } from "./userProfileAction";

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUserProfile: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
