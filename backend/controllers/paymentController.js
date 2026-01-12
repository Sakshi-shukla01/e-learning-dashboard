// backend/controllers/paymentController.js
import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import User from "../models/User.js"; // ✅ must import

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========================= CREATE CHECKOUT SESSION =========================
export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId, courseName, amount } = req.body;
    const userId = req.user.id;

    if (!courseId || !courseName || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: courseName },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({
      userId,
      courseId,
      courseName,
      coursePrice: amount,
      stripeSessionId: session.id,
      paymentStatus: "pending",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("🔥 Stripe error:", error.message);
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
