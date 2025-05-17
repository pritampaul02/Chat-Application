import { createSlice } from "@reduxjs/toolkit";
import {
    deleteMessage,
    deleteReactToMessage,
    editMessage,
    reactToMessage,
} from "./messageAction";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        editing: false,
        deleting: false,
        reacting: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Edit
            .addCase(editMessage.pending, (state) => {
                state.editing = true;
            })
            .addCase(editMessage.fulfilled, (state) => {
                state.editing = false;
            })
            .addCase(editMessage.rejected, (state, action) => {
                state.editing = false;
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteMessage.pending, (state) => {
                state.deleting = true;
            })
            .addCase(deleteMessage.fulfilled, (state) => {
                state.deleting = false;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            })

            // React
            .addCase(reactToMessage.pending, (state) => {
                state.reacting = true;
            })
            .addCase(reactToMessage.fulfilled, (state) => {
                state.reacting = false;
            })
            .addCase(reactToMessage.rejected, (state, action) => {
                state.reacting = false;
                state.error = action.payload;
            })

            // Delete React
            .addCase(deleteReactToMessage.fulfilled, (state, action) => {
                state.reacting = false;
            })
            .addCase(deleteReactToMessage.rejected, (state, action) => {
                state.reacting = false;
                state.error = action.payload;
            });
    },
});

export default messageSlice.reducer;
