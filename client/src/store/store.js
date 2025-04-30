import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import forgotPasswordReducer from "./forgotPassword/forgotPasswordSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        forgotPassword: forgotPasswordReducer,
    },
});

export default store;
