// src/store/status/statusSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    createImageStatus,
    createPollStatus,
    createTextStatus,
    deleteStatus,
    fetchStatuses,
    viewStatus,
} from "./statusAction";

const initialState = {
    statuses: [],
    currentStatus: null,
    loading: false,
    error: null,
    success: null,
};

const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all statuses
            .addCase(fetchStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatuses.fulfilled, (state, action) => {
                state.statuses = action.payload;
                state.loading = false;
            })
            .addCase(fetchStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // View individual status
            .addCase(viewStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(viewStatus.fulfilled, (state, action) => {
                state.currentStatus = action.payload;
                state.loading = false;
            })
            .addCase(viewStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteStatus.fulfilled, (state, action) => {
                state.statuses = state.statuses.filter(
                    (s) => s._id !== action.payload
                );
                state.success = true;
            })
            .addCase(createTextStatus.fulfilled, (state) => {
                state.success = true;
            })
            .addCase(createImageStatus.fulfilled, (state) => {
                state.success = true;
            })
            .addCase(createPollStatus.fulfilled, (state) => {
                state.success = true;
            });
    },
});

export default statusSlice.reducer;
