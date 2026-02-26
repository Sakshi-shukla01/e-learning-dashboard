import express from "express";
import {
  updateProgress,
  getUserCourseProgress,
  updateVideoProgress,
  updateQuizScore,
} from "../controllers/progressController.js";

const router = express.Router();

// Manual/General update
router.post("/update", updateProgress);

// Auto-updates
router.post("/video", updateVideoProgress);
router.post("/quiz", updateQuizScore);

// Fetch user progress
router.get("/:userId/:courseId", getUserCourseProgress);

export default router;
