// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Props: element = component to render
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token"); // check if user is logged in
  if (!token) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }
  // Logged in → show the element
  return element;
};

export default ProtectedRoute;
