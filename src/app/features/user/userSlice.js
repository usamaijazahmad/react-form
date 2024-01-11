import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApiUrl } from "../../../../server/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const initialState = {
  userDataForLogin: {
    email: "",
    password: "",
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
  clearUserState,
  authenticateUser,
  clearUserStateForLogin,
} = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
export const selectUserDataForLogin = (state) => state.user.userDataForLogin;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;
