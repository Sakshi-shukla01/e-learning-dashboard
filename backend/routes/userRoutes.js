import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// ✅ Correct: Get purchased courses
router.get("/purchased-courses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("purchasedCourses");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ purchasedCourses: user.purchasedCourses });
  } catch (error) {
    console.error("Purchased Courses Error:", error);
    res.status(500).json({ message: "Error fetching purchased courses" });
  }
});

export default router;
