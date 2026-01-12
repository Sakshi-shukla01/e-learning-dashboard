import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";

// ✅ Get quiz by course ID
export const getQuizByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId }).populate("course", "title description");
    if (!quiz) {
      return res.status(404).json({ message: "No quiz found for this course" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
};

// ✅ Evaluate quiz answers
export const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // e.g. [{ question: "Q1", selected: "A" }, ...]

    const quiz = await Quiz.findOne({ course: courseId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] && answers[index].selected === q.answer) {
        score++;
      }
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      totalQuestions: quiz.questions.length,
      correctAnswers: score,
      scorePercent: ((score / quiz.questions.length) * 100).toFixed(2),
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Server error while submitting quiz" });
  }
};
