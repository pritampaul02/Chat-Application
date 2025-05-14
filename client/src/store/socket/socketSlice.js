

import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";

const initialState = {
    loading: false,
    error: null,
    success: null,
    message: null,
    socket: {},
    fetchChaListFriends: false,
};

const socketReducer = createSlice({
    name: "socket",
    initialState,
    reducers: {
       
        initializeSocket: (state, action) => {
            console.log("action.payload", action.payload);
             try {
              
               const socket = io( import.meta.env.VITE_BACKEND_BASE_URI , {
                   query: {
                     userId: action.payload.userId,
                   },
                 });
                 
                 state.socket = socket;
                  
                 console.log("socket ===============> " , 
                   socket
                 );
             } catch (error) {
                console.log("error", error);
              
             }
              
            // state.socket = action.payload;
        },
    },
    extraReducers: (builder) => {
       
    },
});

export const { initializeSocket } = socketReducer.actions;

export default socketReducer.reducer;
