import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import userSlice from "./user-slice";
import chatSlice from "./chat-slice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: userSlice,
        chats: chatSlice
    }
});