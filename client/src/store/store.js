import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import forgotPasswordReducer from "./forgotPassword/forgotPasswordSlice";
import chatListReducer from "./chatList/chatListSlice";
import searchReducer from "./search/searchSlice";
import userProfileReducer from "./userProfile/userProfileSlice";
import friendsReducer from "./friends/friendsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotPassword: forgotPasswordReducer,
        chatList: chatListReducer,
        search: searchReducer,
        userProfile: userProfileReducer,
        friends: friendsReducer,
    },
});

export default store;
