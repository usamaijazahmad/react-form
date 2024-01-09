import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  quizData: [],
};

export const fetchQuizData = createAsyncThunk(
  "quiz/fetchQuizData",
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
    builder.addCase(fetchQuizData.fulfilled, (state, action) => {
      const loadedQuizdata = action.payload;
      state.quizData = loadedQuizdata;
    });
  },
});

export const selectQuizData = (state) => state.quiz.quizData;

export default quizSlice.reducer;
