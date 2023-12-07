import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();

  return authenticated ? children : <Navigate to="/logIn" />;
};

export default ProtectedRoute;
