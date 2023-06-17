import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        userData: null,
        didTryAutoLogin: null,
    },
    reducers: {
        authenticate: (state, action) => {
            const { payload } = action
            state.token = payload.token;
            state.userData = payload.userData;
            console.log(payload);
        }
    }
});

export const authenticate = authSlice.actions.authenticate;
export default authSlice.reducer;
