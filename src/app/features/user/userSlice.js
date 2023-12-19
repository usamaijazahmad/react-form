import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApiUrl } from "../../../../server/api";
import axios from "axios";

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

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (email) => {
    const response = await axios.get(usersApiUrl);
    const usersData = response.data;
    const myUser = usersData.filter((user) => user.email === email);
    return myUser[0];
  }
);

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
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserDataForLogin: (state, action) => {
      state.userDataForLogin = action.payload;
    },
    authenticateUser: (state) => {
      state.isAuthenticated = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const loadedUser = action.payload;
      state.userData = loadedUser;
    });
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
