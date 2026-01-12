import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CourseQuiz from "./pages/CourseQuiz";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Cart from "./pages/Cart";
import CourseDetails from "./pages/CourseDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Recommendations from "./pages/Recommendations";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/courses"
          element={<ProtectedRoute element={<Courses />} />}
        />
      <Route
  path="/courses/:id"
  element={<ProtectedRoute element={<CourseDetails />} />}
/>
<Route path="/recommendations" element={<ProtectedRoute element={<Recommendations />} />} />
<Route path="/courses/:id/quiz" element={<CourseQuiz />} />
<Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/cart" element={<Cart />} />
        {/* 404 Page (Catch-All) */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "4rem", fontSize: "1.2rem" }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you’re looking for doesn’t exist.</p>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
