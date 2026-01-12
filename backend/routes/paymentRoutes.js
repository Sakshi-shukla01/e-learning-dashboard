import express from "express";
import { createCheckoutSession, verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// Create checkout session
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

// Verify after Stripe redirect
router.get("/verify", authMiddleware, verifyPayment);

// Check if user already purchased course
router.get("/check/:courseId", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
      paymentStatus: "success",
    });

    res.json({ purchased: !!payment });
  } catch (error) {
    console.error("Error checking purchase:", error);
    res.status(500).json({ message: "Error checking purchase" });
  }
});

export default router;
