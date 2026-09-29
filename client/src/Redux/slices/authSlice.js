const savedAuth = localStorage.getItem("auth");
const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: parsedAuth?.user || null,
  accessToken: parsedAuth?.accessToken || null,
  refreshToken: parsedAuth?.refreshToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.fullname=action.payload.fullname
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.fullname=null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
