import React from "react";
import ReactDOM from "react-dom/client";

import LoginForm from "./components/form/LoginForm.jsx";
import SignUpForm from "./components/form/SignUpForm.jsx";
import NavBar from "./components/common/NavBar.jsx";
import ResultPage from "./components/quiz/ResultPage.jsx";
import PhysicsQuiz from "./components/quiz/subjects/PhysicsQuiz.jsx";
import MathQuiz from "./components/quiz/subjects/MathQuiz.jsx";
import ChemistryQuiz from "./components/quiz/subjects/ChemistryQuiz.jsx";
import HomePage from "./components/home/HomePage.jsx";

import ProtectedRoute from "./protectedRoutes/ProtectedRoute.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store.js";

import "../src/index.css";
import "../src/App.css";
import NotFound from "./components/common/NotFound.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <NavBar />
      <Routes>
        <Route path="/signUp" element={<SignUpForm />}></Route>
        <Route path="/logIn" element={<LoginForm />}></Route>
        <Route path="/notFound" element={<NotFound />}></Route>
        <Route
          path="/physicsQuiz"
          element={
            <ProtectedRoute>
              <PhysicsQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mathQuiz"
          element={
            <ProtectedRoute>
              <MathQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chemistryQuiz"
          element={
            <ProtectedRoute>
              <ChemistryQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homePage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Provider>
  </BrowserRouter>
);
