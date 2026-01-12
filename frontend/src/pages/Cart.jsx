// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import API_URL from "../api";
import { FaTrash, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove course from cart
  const handleRemove = async (courseId) => {
    try {
      await axios.delete(`${API_URL}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { courseId },
      });
      // Update local cart
      setCartItems(cartItems.filter((c) => c.courseId !== courseId));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading cart...</p>
    );

  if (cartItems.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Your cart is empty</h2>
        <Link
          to="/courses"
          style={{
            marginTop: "1rem",
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#6366f1",
            color: "#fff",
            borderRadius: "0.5rem",
            textDecoration: "none",
          }}
        >
          Explore Courses
        </Link>
      </div>
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Your Cart</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {cartItems.map((course) => (
          <div
            key={course.courseId}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={course.image || "/default-course.png"}
              alt={course.title}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                <FaBook style={{ marginRight: "0.25rem" }} /> {course.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "1rem" }}>
                {course.description?.slice(0, 100)}...
              </p>
              <button
                onClick={() => handleRemove(course.courseId)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <FaTrash style={{ marginRight: "0.25rem" }} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
