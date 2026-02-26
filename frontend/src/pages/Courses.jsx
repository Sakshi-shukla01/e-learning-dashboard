import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../api";
import "../assets/styles.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/courses`);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading courses...</p>;

  if (courses.length === 0)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No courses available.</p>;

  return (
    <div className="courses-page" style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Explore All Courses</h1>
      <div className="courses-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {courses.map(course => (
          <div key={course._id} className="course-card" style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}>
            <img
              src={course.image || "/default-course.png"}
              alt={course.title}
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
            <div className="course-info" style={{ padding: "1rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                {course.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: "0.5rem" }}>
                {course.description.slice(0, 100)}...
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.75rem" }}>
                <span>Duration: {course.duration || "N/A"}h</span>
                <span>Category: {course.category || "General"}</span>
              </div>
              <Link
  to={`/courses/${course._id}`}
  style={{
    display: "inline-block",
    textAlign: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "#6366f1",
    color: "#fff",
    borderRadius: "0.5rem",
    textDecoration: "none",
    fontWeight: "500",
    width: "100%",
    transition: "background-color 0.2s"
  }}
>
  View Details
</Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
