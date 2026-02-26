import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  level: { type: String, required: true },
  image: { type: String, required: true },
  videoUrl: { type: String, required: false },

  whatYouWillLearn: [{ type: String }],
  syllabus: [{ type: String }],

  progress: { type: Number, default: 0 },

  // ✅ NEW FIELD (S3 file key)
  notesKey: { type: String },

  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Course", courseSchema);