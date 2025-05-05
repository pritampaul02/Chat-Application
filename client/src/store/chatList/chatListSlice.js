import { createSlice } from "@reduxjs/toolkit";
import { fetchChaListFriends } from "./chatAction";

const initialState = {
    loading: false,
    error: null,
    success: null,
    message: null,
    user: {},
    fetchChaListFriends: false,
};

const chatListSlice = createSlice({
    name: "chatList",
    initialState,
    reducers: {
        clearChatListState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
            state.message = null;
            state.user = null;
            state.fetchChaListFriends = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChaListFriends.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
                state.fetchChaListFriends = false;
            })
            .addCase(fetchChaListFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload || "User fetched successfully";
                state.user = action.payload;
                state.fetchChaListFriends = true;
            })
            .addCase(fetchChaListFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get user";
                state.fetchChaListFriends = false;
            });
    },
});

export const { clearChatListState } = chatListSlice.actions;
export default chatListSlice.reducer;
