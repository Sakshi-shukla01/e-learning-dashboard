import "dotenv/config"; // ✅ BEST for ES Modules (loads .env before everything)

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; // ✅ ES module import
import { getSignedDownloadUrl } from "./utils/s3.js";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes); // ✅ Cart routes
// ✅ TEST ROUTE FOR S3 (temporary)
// app.get("/api/test-s3", async (req, res) => {
//   try {
//     // ⚠️ put an EXACT key from your S3 bucket
//     const key = "notes/advancephysics.pdf";
//     const url = await getSignedDownloadUrl(key);
//     res.json({ url });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.use("/notes", express.static(path.join(process.cwd(), "public", "notes")));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});