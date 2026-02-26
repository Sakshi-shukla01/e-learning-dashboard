import express from "express";
import { getCourses, addCourse, getCourseById } from "../controllers/courseController.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSignedDownloadUrl } from "../utils/s3.js";   // ✅ ADD THIS

const router = express.Router();

// ====== COURSE ROUTES ======
router.get("/", getCourses);          // Get all courses
router.get("/:id", getCourseById);    // Get course by ID
router.post("/add", addCourse);       // Admin: Add new course

// ====== BUY COURSE ROUTE (IMPORTANT) ======
router.post("/buy", authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicate purchase
    if (!user.purchasedCourses.includes(courseId)) {
      user.purchasedCourses.push(courseId);
      await user.save();
    }

    res.json({ message: "🎉 Course purchased successfully" });
  } catch (error) {
    console.error("Buy course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ====== PROGRESS UPDATE ROUTE ======
router.put("/:id/progress", async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Invalid progress value" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.progress = progress;
    await course.save();

    res.json({ message: "✅ Progress updated successfully", progress });
  } catch (error) {
    console.error("Error updating course progress:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// =======================================================
// ✅ NEW ROUTE: GET SECURE NOTES DOWNLOAD LINK (S3)
// =======================================================
router.get("/:id/notes-link", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(userId);

    // 🔒 allow download only if purchased
    if (!user.purchasedCourses.includes(courseId)) {
      return res.status(403).json({ message: "Purchase course to access notes" });
    }

    if (!course.notesKey) {
      return res.status(400).json({ message: "Notes not available" });
    }

    const url = await getSignedDownloadUrl(course.notesKey);

    res.json({ url });

  } catch (error) {
    console.error("Notes download error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;