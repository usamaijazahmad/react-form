import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  quizData: [],
  quizAnsData: [],
};

export const fetchQuizData = createAsyncThunk(
  "quiz/fetchQuizData",
  async (url) => {
    const response = await axios.get(url);
    return [...response.data];
  }
);

export const fetchQuizAnsData = createAsyncThunk(
  "quiz/fetchQuizAnsData",
  async (url) => {
    const response = await axios.get(url);
    return [...response.data];
  }
);

const quizSlice = createSlice({
  name: "qiiz",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        const loadedQuizdata = action.payload;
        state.quizData = loadedQuizdata;
      })
      .addCase(fetchQuizAnsData.fulfilled, (state, action) => {
        const loadedQuizAnsdata = action.payload;
        state.quizAnsData = loadedQuizAnsdata;
      });
  },
});

export const selectQuizData = (state) => state.quiz.quizData;
export const selectQuizAnsData = (state) => state.quiz.quizAnsData;

export default quizSlice.reducer;
