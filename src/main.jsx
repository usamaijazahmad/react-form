import React from "react";
import ReactDOM from "react-dom/client";
import "../src/index.css";
import "../src/App.css";

import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/signUp" element={<SignUpForm />}></Route>
      <Route path="/logIn" element={<LoginForm />}></Route>
      <Route path="*" element={<LoginForm />}></Route>
    </Routes>
  </BrowserRouter>
);
