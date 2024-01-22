import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userDataForLogin: {
    email: "",
    password: "",
  },
  userDataForVerifyEmail: {
    email: "",
  },
  userDataForOtpVerify: {
    otp: "",
  },
  userData: {
    email: "",
    password: "",
    name: "",
  },
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserStateForLogin: (state) => {
      state.userDataForLogin = {
        email: "",
        password: "",
      };
    },
    clearUserStateForVerifyEmail: (state) => {
      state.userDataForVerifyEmail = {
        email: "",
      };
    },
    clearUserStateForOtpVerify: (state) => {
      state.userDataForOtpVerify = {
        otp: "",
      };
    },
    clearUserState: (state) => {
      state.userData = {
        email: "",
        password: "",
        name: "",
      };
    },
    setUserData: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { data } = jwtDecode(token);
        state.userData = data;
      }
    },
    setUserDataForLogin: (state, action) => {
      state.userDataForLogin = action.payload;
    },
    setUserDataForVerifyEmail: (state, action) => {
      state.userDataForVerifyEmail = action.payload;
    },
    setUserDataForOtpVerify: (state, action) => {
      state.userDataForOtpVerify = action.payload;
    },
    authenticateUser: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});

export const {
  setUserData,
  setUserDataForLogin,
  setUserDataForVerifyEmail,
  setUserDataForOtpVerify,
  clearUserState,
  authenticateUser,
  clearUserStateForLogin,
  clearUserStateForVerifyEmail,
  clearUserStateForOtpVerify,
} = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectUserDataForLogin = (state) => state.user.userDataForLogin;
export const selectUserDataForVerifyEmail = (state) =>
  state.user.userDataForVerifyEmail;
export const selectUserDataForOtpVerify = (state) =>
  state.user.userDataForOtpVerify;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
