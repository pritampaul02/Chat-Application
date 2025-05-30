import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import forgotPasswordReducer from "./forgotPassword/forgotPasswordSlice";
import chatListReducer from "./chatList/chatListSlice";
import chatReducer from "./chat/chatSlice";
import searchReducer from "./search/searchSlice";
import userProfileReducer from "./userProfile/userProfileSlice";
import friendsReducer from "./friends/friendsSlice";
import messageReducer from "../store/message/messageSlice";
import statusReducer from "../store/status/statusSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotPassword: forgotPasswordReducer,
        chatList: chatListReducer,
        chat: chatReducer,
        search: searchReducer,
        userProfile: userProfileReducer,
        friends: friendsReducer,
        message: messageReducer,
        status: statusReducer,
    },
});

export default store;
