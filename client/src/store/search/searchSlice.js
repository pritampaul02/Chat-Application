import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "./searchAction";
// import { fetchUsers } from "./searchActions";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        users: [],
        loading: false,
        error: null,
        hasMore: true,
        skip: 0,
        limit: 10,
        query: "",
    },
    reducers: {
        resetSearch(state) {
            state.users = [];
            state.skip = 0;
            state.hasMore = true;
            state.query = "";
            state.error = null;
        },
        setQuery(state, action) {
            state.query = action.payload;
            state.skip = 0;
            state.users = [];
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = [...state.users, ...action.payload.users];
                state.hasMore = action.payload.hasMore;
                state.skip += state.limit;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetSearch, setQuery } = searchSlice.actions;
export default searchSlice.reducer;
