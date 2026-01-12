import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";

import { FaBook, FaStar, FaTasks, FaClock, FaDownload, FaEye } from "react-icons/fa";
import "../assets/styles.css";
import YouTubePlayer from "../components/YouTubePlayer";

const CourseDetails = () => {
  const { id } = useParams();
  const { fetchCart } = useCart();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [quiz, setQuiz] = useState(null);

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_URL}/courses/${id}`);
        const data = await res.json();
        setCourse(data.course || null);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();

    // ✅ Check purchase status
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`http://localhost:5000/api/payment/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.purchased) setPurchased(true);
        })
        .catch(() => {
          const purchasedCourses =
            JSON.parse(localStorage.getItem("purchasedCourses")) || [];
          if (purchasedCourses.includes(id)) setPurchased(true);
        });
    }
  }, [id]);

  // ✅ Fetch quiz only when purchased
  useEffect(() => {
    if (purchased) {
      const fetchQuiz = async () => {
        try {
          const res = await fetch(`${API_URL}/quizzes/${id}`);
          const data = await res.json();
          setQuiz(data.quiz || null);
        } catch (err) {
          console.error("Error fetching quiz:", err);
        }
      };
      fetchQuiz();
    }
  }, [purchased, id]);

  // ✅ Add to Cart
const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");
    if (!course) return alert("Course data not loaded yet!");

    await axios.post(
      `${API_URL}/cart/add`,
      {
        courseId: course._id,
        title: course.title,
        image: course.image || "",
        description: course.description || "",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("✅ Course added to cart!");
    fetchCart(); // ✅ update cart icon dynamically
  } catch (err) {
    console.error("Error adding to cart:", err.response || err);
    alert(err.response?.data?.message || "Failed to add course to cart.");
  }
};



  // ✅ Buy Now (Stripe Checkout)
  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first!");

      setLoadingPayment(true);

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-checkout-session",
        {
          courseId: course._id,
          courseName: course.title,
          amount: course.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error("Payment API failed");
      }
    } catch (err) {
      console.error("❌ Error during checkout:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  // ✅ Verify payment after Stripe redirect
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");
    const courseId = query.get("courseId");

    if (sessionId && courseId) {
      const verifyPayment = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/payment/verify?session_id=${sessionId}&courseId=${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.success) {
            setPurchased(true);
            let purchasedList =
              JSON.parse(localStorage.getItem("purchasedCourses")) || [];
            if (!purchasedList.includes(courseId)) {
              purchasedList.push(courseId);
              localStorage.setItem(
                "purchasedCourses",
                JSON.stringify(purchasedList)
              );
            }
            alert("✅ Payment verified and course unlocked!");
            // Redirect directly to quiz after payment
            setTimeout(() => {
              window.location.href = `/courses/${courseId}/quiz`;
            }, 2000);
          }
        } catch (error) {
          console.error("❌ Error verifying payment:", error);
        }
      };
      verifyPayment();
    }
  }, []);

  if (loading) return <Loader />;
  if (!course)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem", color: "#ef4444" }}>
        Course not found.
      </p>
    );

  return (
    <div
      className="course-details-container"
      style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <img
          src={course.image || "/default-course.png"}
          alt={course.title}
          style={{
            width: "400px",
            height: "250px",
            objectFit: "cover",
            borderRadius: "10px",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
            {course.title}
          </h1>
          <p style={{ fontSize: "1rem", color: "#4b5563", marginBottom: "1rem" }}>
            {course.description}
          </p>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <span>
              <FaClock /> Duration: {course.duration || "N/A"}h
            </span>
            <span>
              <FaBook /> Category: {course.category || "General"}
            </span>
            <span>
              <FaTasks /> Progress: {course.progress || 0}%
            </span>
          </div>

          <Link
            to="/courses"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.5rem 1.2rem",
              backgroundColor: "#6366f1",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            ← Back to Courses
          </Link>
        </div>
      </div>

      {/* PURCHASE SECTION */}
      <h2 style={{ marginTop: "1rem", color: "#fff" }}>{course.title}</h2>
      <p style={{ color: "#ccc" }}>{course.description}</p>
      <p style={{ color: "#60a5fa" }}>Price: ₹{course.price}</p>

      {!purchased ? (
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button onClick={handleAddToCart} className="btn btn-secondary">
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={loadingPayment}
            className="btn btn-primary"
          >
            {loadingPayment ? "Processing..." : "Buy Now"}
          </button>
        </div>
      ) : (
        <p style={{ color: "#10b981", marginTop: "1rem" }}>
          ✅ Course Purchased — All content unlocked!
        </p>
      )}

      {/* WHAT YOU’LL LEARN */}
      <section style={{ marginTop: "2rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          What You’ll Learn
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {(course.learn || [
            "Understand core concepts",
            "Hands-on exercises",
            "Real-world projects",
            "Advanced techniques",
          ]).map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#131315",
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaStar color="#fbbf24" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COURSE CONTENT */}
      <section style={{ marginTop: "2rem" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          Course Content
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {(course.content || [
            { title: "Introduction", duration: "10min" },
            { title: "Module 1: Basics", duration: "1h 30min" },
            { title: "Module 2: Advanced Topics", duration: "2h" },
            { title: "Final Project", duration: "3h" },
          ]).map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#0d0e0f",
                padding: "0.75rem 1rem",
                borderRadius: "6px",
              }}
            >
              <span>{item.title}</span>
              <span style={{ color: "#6b7280" }}>{item.duration}</span>
            </div>
          ))}
        </div>
      </section>

      {/* UNLOCKED CONTENT */}
      {purchased && (
        <>
          {/* Video Section */}
          <section style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
              🎥 Course Video
            </h2>
            {course.videoUrl ? (
              <YouTubePlayer courseId={course._id} videoUrl={course.videoUrl} />
            ) : (
              <p style={{ color: "#60a5fa" }}>No video available.</p>
            )}
          </section>

          {/* Notes Section */}
          {course.notes && (
            <section style={{ marginTop: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
                📘 Course Notes
              </h2>
              <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                <a
                  href={course.notes}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-info"
                >
                  <FaEye /> Preview Notes
                </a>
                <a href={course.notes} download className="btn btn-success">
                  <FaDownload /> Download Notes
                </a>
              </div>
              <iframe
                src={course.notes}
                title="Course Notes"
                width="100%"
                height="500px"
                style={{ border: "1px solid #333", borderRadius: "8px" }}
              ></iframe>
            </section>
          )}

          {/* 🧠 Quiz Section */}
          {/* 🧠 Quiz Section (Visible only after successful payment) */}
{purchased && (
  <section style={{ marginTop: "2rem", textAlign: "center" }}>
    <h2
      style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1rem",
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: "0.5rem",
      }}
    >
      Ready for a Quick Quiz?
    </h2>

    <Link
      to={`/courses/${course._id}/quiz`}
      style={{
        display: "inline-block",
        backgroundColor: "#6366f1",
        color: "#fff",
        padding: "0.6rem 1.5rem",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "500",
        transition: "0.3s",
      }}
    >
      Take Quiz →
    </Link>
  </section>
)}
        </>
      )}
    </div>
  );
};

export default CourseDetails;
