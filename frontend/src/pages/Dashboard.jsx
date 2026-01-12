import React, { useEffect, useState } from "react";
import "../assets/styles.css";
import API_URL from "../api";
import { FaBook, FaStar, FaTasks } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const navigate = useNavigate();

  // Add to Cart handler
  const handleAddToCart = (course) => {
    const isPurchased = purchasedCourses.find((c) => c._id === course._id);
    if (isPurchased) {
      alert("You have already purchased this course");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = existingCart.find((c) => c._id === course._id);

    if (isAlreadyInCart) {
      alert("Course already in cart");
      navigate("/cart");
      return;
    }

    const updatedCart = [...existingCart, course];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${course.title} added to cart`);
    navigate("/cart");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/courses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setCourses(data.courses || []);

        const purchased = (data.courses || []).filter((c) => c.purchased === true);
        setPurchasedCourses(purchased);
      } catch (err) {
        console.error(err);
        setCourses([]);
        setPurchasedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchPurchasedCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/users/purchased-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPurchasedCourses(data.purchasedCourses || []);
      } catch (error) {
        console.error("Error fetching purchased courses", error);
        setPurchasedCourses([]);
      }
    };

    fetchCourses();
    fetchPurchasedCourses();
  }, []);

  if (loading)
    return (
      <p className="loading" style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading courses...
      </p>
    );

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const recommendedCourses = courses.filter((c) => c.recommended);

  const isPurchased = (course) =>
    purchasedCourses.some((c) => c._id === course._id);

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      {/* Header */}
      <header className="dashboard-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1>Welcome to Your Learning Dashboard</h1>
        <Link
          to="/courses"
          className="explore-btn"
          style={{
            marginTop: "1rem",
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "#6366f1",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Explore All Courses
        </Link>
      </header>

      {/* Enrolled Courses */}
      <section className="course-section" style={{ marginBottom: "3rem" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaBook /> Your Courses
          <Link to="/courses" style={{ marginLeft: "1rem", fontSize: "0.9rem", color: "#6366f1" }}>
            Explore All Courses
          </Link>
        </h2>

        {enrolledCourses.length === 0 ? (
          <div className="no-courses-card" style={{ textAlign: "center", marginTop: "2rem" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2910/2910766.png"
              alt="No courses"
              style={{ width: "150px", marginBottom: "1rem" }}
            />
            <h3>No courses enrolled yet</h3>
            <p>Start learning by exploring our wide range of courses.</p>
            <Link
              to="/courses"
              className="explore-btn"
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
        ) : (
          <div
            className="course-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="course-card"
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
                <div className="course-info" style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    <FaBook style={{ marginRight: "0.25rem" }} /> {course.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.5rem" }}>
                    {course.description.slice(0, 100)}...
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(course)}
                    disabled={isPurchased(course)}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: isPurchased(course) ? "#9ca3af" : "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: isPurchased(course) ? "not-allowed" : "pointer",
                    }}
                  >
                    {isPurchased(course) ? "Purchased" : "Add to Cart"}
                  </button>

                  <div
                    className="progress-bar-container"
                    style={{
                      background: "#e5e7eb",
                      borderRadius: "4px",
                      height: "6px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width: `${course.progress || 0}%`,
                        height: "100%",
                        backgroundColor: "#6366f1",
                        borderRadius: "4px",
                      }}
                    ></div>
                  </div>
                  <p className="course-meta" style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                    <FaTasks /> Progress: {course.progress || 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <section className="recommendation-section">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaStar /> Recommended for You
            <Link to="/courses" style={{ marginLeft: "1rem", fontSize: "0.9rem", color: "#6366f1" }}>
              View All
            </Link>
          </h2>
          <div
            className="course-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            {recommendedCourses.map((course) => (
              <div
                key={course._id}
                className="course-card"
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
                <div className="course-info" style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    <FaStar style={{ marginRight: "0.25rem" }} /> {course.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.5rem" }}>
                    {course.description.slice(0, 100)}...
                  </p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(course)}
                    disabled={isPurchased(course)}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: isPurchased(course) ? "#9ca3af" : "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: isPurchased(course) ? "not-allowed" : "pointer",
                    }}
                  >
                    {isPurchased(course) ? "Purchased" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Purchased Courses */}
      <section className="course-section" style={{ marginTop: "3rem" }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaStar /> Purchased Courses
        </h2>

        {purchasedCourses.length === 0 ? (
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            You haven’t purchased any course yet.
          </p>
        ) : (
          <div
            className="course-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            {purchasedCourses.map((course) => (
              <div
                key={course._id}
                className="course-card"
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
                <div className="course-info" style={{ padding: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                    {course.description?.slice(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
