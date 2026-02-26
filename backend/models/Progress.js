import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    // 🔹 User linked to this progress record
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Course being tracked
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // 🔹 Current percentage of course completed (0–100)
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 🔹 Total time spent watching videos (in minutes)
    time_spent: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔹 Quiz/test score (0–100 scale)
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 🔹 Whether the course is marked completed
    completed: {
      type: Boolean,
      default: false,
    },

    // 🔹 Index or ID of the last watched lesson/video
    last_lesson: {
      type: Number,
      default: 0,
    },

    // 🔹 Stores timestamps for when user watched or submitted quizzes
    activity_log: [
      {
        type: {
          type: String,
          enum: ["video", "quiz"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: {
          type: Object,
          default: {},
        },
      },
    ],

    // 🔹 Last time user accessed this course
    last_accessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate user-course records
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// ✅ Auto-mark as completed when progress reaches 100%
progressSchema.pre("save", function (next) {
  if (this.progress >= 100) {
    this.completed = true;
  }
  this.last_accessed = new Date();
  next();
});

// ✅ Method to log activities like video or quiz actions
progressSchema.methods.addActivity = function (type, details = {}) {
  this.activity_log.push({ type, details });
  this.last_accessed = new Date();
  return this.save();
};

export default mongoose.model("Progress", progressSchema);
