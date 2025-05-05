import { createSlice } from "@reduxjs/toolkit";
import {
    sendFriendRequest,
    cancelFriendRequest,
    manageFriendRequest,
} from "./friendsAction";

const friendsSlice = createSlice({
    name: "friends",
    initialState: {
        sending: false,
        success: null,
        error: null,
    },
    reducers: {
        resetFriendState: (state) => {
            state.sending = false;
            state.success = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Friend Request
            .addCase(sendFriendRequest.pending, (state) => {
                state.sending = true;
                state.success = null;
                state.error = null;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.sending = false;
                state.success =
                    action.payload?.message || "Friend request sent";
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload || "Failed to send request";
            })

            // Cancel Friend Request
            .addCase(cancelFriendRequest.pending, (state) => {
                state.sending = true;
                state.success = null;
                state.error = null;
            })
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                state.sending = false;
                state.success = action.payload?.message || "Request cancelled";
            })
            .addCase(cancelFriendRequest.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload || "Failed to cancel request";
            })

            // manage friend requests

            .addCase(manageFriendRequest.pending, (state) => {
                state.sending = true;
                state.success = null;
                state.error = null;
            })
            .addCase(manageFriendRequest.fulfilled, (state, action) => {
                state.sending = false;
                state.success = action.payload?.message || "Request cancelled";
            })
            .addCase(manageFriendRequest.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload || "Failed to cancel request";
            });
    },
});

export const { resetFriendState } = friendsSlice.actions;
export default friendsSlice.reducer;
