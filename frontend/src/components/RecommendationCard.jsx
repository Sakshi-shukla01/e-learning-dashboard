import React from "react";

const RecommendationCard = ({ course }) => {
  // Safety check: if course is undefined/null
  if (!course) return null;

  return (
    <div
      className="course-card"
      style={{
        border: "1px solid #444",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.1rem",
      }}
    >
      <div>{course.name || "No course available"}</div>
      {course.progress !== undefined && <div>Progress: {course.progress}%</div>}
      {course.score !== undefined && <div>Score: {course.score}</div>}
    </div>
  );
};

export default RecommendationCard;
