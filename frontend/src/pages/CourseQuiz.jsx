import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../api";
import Loader from "../components/Loader";

const CourseQuiz = () => {
  const { id } = useParams(); // course ID
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch quiz data for this course
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${API_URL}/quizzes/${id}`);
        const data = await res.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // ✅ Handle option selection
  const handleOptionChange = (qIndex, selectedOption) => {
    setAnswers({ ...answers, [qIndex]: selectedOption });
  };

  // ✅ Submit quiz
  const handleSubmit = async () => {
    const payload = {
      answers: quiz.questions.map((q, i) => ({
        question: q.question,
        selected: answers[i] || "",
      })),
    };

    try {
      const res = await fetch(`${API_URL}/quizzes/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <Loader />;

  if (!quiz)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "#ef4444" }}>
        No quiz available for this course.
      </div>
    );

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
        🧠 {quiz.course?.title || "Course Quiz"}
      </h1>

      {!result ? (
        <>
          {quiz.questions.map((q, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#111827",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
                {index + 1}. {q.question}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    style={{
                      backgroundColor:
                        answers[index] === option ? "#4f46e5" : "#1f2937",
                      color: "#fff",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      style={{ marginRight: "10px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#6366f1",
              color: "#fff",
              padding: "0.7rem 1.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              display: "block",
              margin: "1rem auto",
            }}
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <div
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h2>🎯 Quiz Results</h2>
          <p>Total Questions: {result.totalQuestions}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Score: {result.scorePercent}%</p>
          <Link
            to="/courses"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.6rem 1.2rem",
              backgroundColor: "#6366f1",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            ← Back to Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default CourseQuiz;
