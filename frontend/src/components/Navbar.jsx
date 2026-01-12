import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { cartCount } = useCart(); // dynamic cart count

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1.25rem",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="logo"
        style={{ fontWeight: 700, color: "#1a73e8", fontSize: "1.1rem" }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Learnly
        </Link>
      </div>

      <div style={{ flex: 1 }}>
        <input
          type="search"
          placeholder="Search courses, e.g. React, Python..."
          className="nav-search"
          style={{
            width: "320px",
            padding: "8px 12px",
            borderRadius: 20,
            border: "1px solid #e3e3e3",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link to="/courses" style={{ textDecoration: "none", color: "#333" }}>
          Explore
        </Link>
        <Link
          to="/recommendations"
          style={{ textDecoration: "none", color: "#333" }}
        >
          Recommended
        </Link>

        {token && (
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              textDecoration: "none",
              color: "#333",
              position: "relative",
            }}
          >
            <FaShoppingCart size={18} />
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.75rem",
              }}
            >
              {cartCount}
            </span>
          </Link>
        )}

        {token ? (
          <>
            <Link
              to="/profile"
              style={{ textDecoration: "none", color: "#333" }}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: "8px 12px",
                background: "#1a73e8",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                padding: "8px 12px",
                border: "1px solid #1a73e8",
                color: "#1a73e8",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
