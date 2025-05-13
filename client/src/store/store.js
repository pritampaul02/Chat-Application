import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import forgotPasswordReducer from "./forgotPassword/forgotPasswordSlice";
import chatListReducer from "./chatList/chatListSlice";
import chatReducer from "./chat/chatSlice";
import searchReducer from "./search/searchSlice";
import userProfileReducer from "./userProfile/userProfileSlice";
import friendsReducer from "./friends/friendsSlice";
import socketReducer from "./socket/socketSlice";
import messageReducer from "../store/message/messageSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotPassword: forgotPasswordReducer,
        chatList: chatListReducer,
        chat: chatReducer,
        search: searchReducer,
        userProfile: userProfileReducer,
        friends: friendsReducer,
        socket: socketReducer,
        message: messageReducer,
    },
});

export default store;
