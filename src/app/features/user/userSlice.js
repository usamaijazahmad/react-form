import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userDataForLogin: {
    email: "",
    password: "",
  },
  userDataForSignup: {
    name: "",
    email: "",
    password: "",
  },
  userDataForVerifyEmail: {
    email: "",
  },
  userDataForOtpVerify: {
    otp: "",
  },
  userDataForNewPassword: {
    password: "",
  },
  userData: {},
  isAuthenticated: false,
  emailIsValid: false,
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
    clearUserStateForSignup: (state) => {
      state.userDataForSignup = {
        email: "",
        password: "",
        name: "",
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
    clearUserStateForNewPassword: (state) => {
      state.userDataForNewPassword = {
        password: "",
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
    setUserDataForSignup: (state, action) => {
      state.userDataForSignup = action.payload;
    },
    setUserDataForVerifyEmail: (state, action) => {
      state.userDataForVerifyEmail = action.payload;
    },
    setUserDataForOtpVerify: (state, action) => {
      state.userDataForOtpVerify = action.payload;
    },
    setUserDataForNewPassword: (state, action) => {
      state.userDataForNewPassword = action.payload;
    },
    authenticateUser: (state) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
    setEmailIsValid: (state, action) => {
      state.emailIsValid = action.payload;
    },
  },
});

export const {
  setUserData,
  setUserDataForLogin,
  setUserDataForSignup,
  setEmailIsValid,
  setUserDataForVerifyEmail,
  setUserDataForOtpVerify,
  setUserDataForNewPassword,
  clearUserState,
  authenticateUser,
  clearUserStateForLogin,
  clearUserStateForSignup,
  clearUserStateForVerifyEmail,
  clearUserStateForOtpVerify,
  clearUserStateForNewPassword,
} = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectUserDataForLogin = (state) => state.user.userDataForLogin;
export const selectUserDataForSignup = (state) => state.user.userDataForSignup;
export const selectUserDataForVerifyEmail = (state) =>
  state.user.userDataForVerifyEmail;
export const selectUserDataForOtpVerify = (state) =>
  state.user.userDataForOtpVerify;
export const selectUserDataForNewPassword = (state) =>
  state.user.userDataForNewPassword;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectEmailIsValid = (state) => state.user.emailIsValid;

export default userSlice.reducer;
