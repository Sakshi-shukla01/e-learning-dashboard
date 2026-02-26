import React, { useState } from "react";
import Loader from "../components/Loader";
import RecommendationCard from "../components/RecommendationCard";

const API_URL = "http://localhost:5001"; // Flask ML backend

const knownCourses = [
  "Python Basics",
  "Python Intermediate",
  "Data Science",
  "Advanced Physics",
  "Digital Marketing",
  "English Grammar",
];
const knownCategories = ["Coding", "Science", "Business", "Language", "Math"];

const Recommendations = () => {
  const [input, setInput] = useState({
    course_name: knownCourses[0],
    category: knownCategories[0],
    progress: "",
    score: "",
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setRecommendation(null);

  try {
    // Try predicting first
    let res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_name: input.course_name,
        category: input.category,
        progress: Number(input.progress),
        score: Number(input.score),
      }),
    });

    // If model not loaded (400), retrain first
    if (res.status === 400) {
      console.log("⚠️ Model not loaded. Retraining automatically...");
      const retrainRes = await fetch(`${API_URL}/retrain`, { method: "POST" });
      if (!retrainRes.ok) throw new Error("Failed to retrain model");

      // Retry prediction
      res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: input.course_name,
          category: input.category,
          progress: Number(input.progress),
          score: Number(input.score),
        }),
      });
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log("Backend recommendation:", data.recommended_course);

    const recommendedCourse =
      data.recommended_course && typeof data.recommended_course === "string"
        ? data.recommended_course
        : "Advanced English"; // fallback

    setRecommendation(recommendedCourse);

  } catch (err) {
    console.error("⚠️ Error fetching recommendation:", err);
    setError(
      "Failed to get recommendation. Please check if Flask backend is running."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">🎓 Course Recommendation</h2>

        <form onSubmit={handleSubmit}>
          <label>Course Name:</label>
          <select
            name="course_name"
            value={input.course_name}
            onChange={handleChange}
          >
            {knownCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <label>Category:</label>
          <select
            name="category"
            value={input.category}
            onChange={handleChange}
          >
            {knownCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Progress (%):</label>
          <input
            type="number"
            name="progress"
            placeholder="Enter your course progress"
            value={input.progress}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />

          <label>Score:</label>
          <input
            type="number"
            name="score"
            placeholder="Enter your score"
            value={input.score}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Get Recommendation"}
          </button>
        </form>

        {loading && <Loader />}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {!loading && recommendation && (
          <div style={{ marginTop: "1.5rem" }}>
            <h3>✨ Recommended Next Course:</h3>
            <RecommendationCard
              course={{
                name: recommendation,
                progress: input.progress,
                score: input.score,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
