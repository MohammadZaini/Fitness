import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import userSlice from "./user-slice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: userSlice
    }
});