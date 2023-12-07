import React from "react";
import ReactDOM from "react-dom/client";
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/index.css";
import "../src/App.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import HomePage from "./components/HomePage.jsx";
import ProtectedRoute from "./protectedRoutes/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/signUp" element={<SignUpForm />}></Route>
        <Route path="/logIn" element={<LoginForm />}></Route>
        <Route
          path="/homePage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoginForm />}></Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
