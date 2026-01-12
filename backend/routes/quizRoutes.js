import express from "express";
import { getQuizByCourseId, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();

// ✅ Get quiz for a specific course
router.get("/:courseId", getQuizByCourseId);

// ✅ Submit quiz answers for evaluation
router.post("/:courseId/submit", submitQuiz);

export default router;
