import React, { useState } from "react";
import API_URL from "../api";

const QuizSection = ({ courseId, userId, onScoreUpdate }) => {
  const [questions] = useState([
    {
      question: "What does ML stand for?",
      options: ["Machine Learning", "Main Logic", "Modern Language"],
      answer: "Machine Learning",
    },
    {
      question: "Which library is popular for data visualization in Python?",
      options: ["NumPy", "Matplotlib", "TensorFlow"],
      answer: "Matplotlib",
    },
  ]);

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const handleSubmit = async () => {
    let obtained = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) obtained += 1;
    });
    const result = Math.round((obtained / questions.length) * 100);
    setScore(result);

    // Save score in backend
    await fetch(`${API_URL}/progress/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userId,
        course: courseId,
        score: result,
      }),
    });

    onScoreUpdate(result);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ fontWeight: "600", marginBottom: "1rem" }}>Course Quiz</h3>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <p>{i + 1}. {q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx} style={{ display: "block", marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`q${i}`}
                value={opt}
                onChange={() => handleAnswerChange(i, opt)}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Submit Quiz
      </button>
      {score !== null && (
        <p style={{ marginTop: "1rem" }}>Your Score: {score}%</p>
      )}
    </div>
  );
};

export default QuizSection;
