// backend/controllers/paymentController.js
import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import User from "../models/User.js"; // ✅ must import
import Course from "../models/Course.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================= CREATE CHECKOUT SESSION =========================
export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // ✅ Fetch course from DB
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const amount = course.price || 499; // fallback

    console.log("✅ Stripe Debug:", {
      courseId,
      name: course.title,
      amount,
    });

    const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://e-learning-dashboard-8gs4.vercel.app"
    : "http://localhost:5173";

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items: [
    {
      price_data: {
        currency: "inr",
        product_data: { name: course.title },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    },
  ],
  success_url: `${FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
  cancel_url: `${FRONTEND_URL}/payment-cancel`,
});

    await Payment.create({
      userId,
      courseId,
      courseName: course.title,
      coursePrice: amount,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("🔥 Stripe FULL error:", error);
    res.status(500).json({ error: error.message });
  }
};
// ============================= VERIFY PAYMENT ============================
export const verifyPayment = async (req, res) => {
  try {
    const { session_id, courseId } = req.query;
    const userId = req.user.id;

    if (!session_id || !courseId)
      return res.status(400).json({ message: "Missing session_id or courseId" });

    // Fetch session details
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {

      // 1️⃣ Update payment status in DB
      const payment = await Payment.findOneAndUpdate(
        { userId, stripeSessionId: session_id },
        { paymentStatus: "success" },
        { new: true }
      );

      // 2️⃣ Add purchased course to user profile
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchasedCourses: courseId } }, // prevent duplicates
        { new: true }
      );

      console.log("🎉 Course added to user's purchasedCourses");

      return res.json({
        success: true,
        message: "Payment verified & course unlocked",
      });
    }

    res.json({ success: false, message: "Payment not completed yet" });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
