import Progress from "../models/Progress.js";

// 🔹 Update or create progress record (manual/general update)
export const updateProgress = async (req, res) => {
  try {
    const { user, course, progress, score, time_spent, last_lesson } = req.body;

    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required." });
    }

    let record = await Progress.findOne({ user, course });

    if (!record) {
      record = new Progress({
        user,
        course,
        progress: progress || 0,
        score: score || 0,
        time_spent: time_spent || 0,
        last_lesson: last_lesson || 0,
      });
    } else {
      record.progress = progress ?? record.progress;
      record.score = score ?? record.score;
      record.time_spent += time_spent || 0;
      record.last_lesson = last_lesson ?? record.last_lesson;
      record.last_accessed = Date.now();

      if (record.progress >= 100) record.completed = true;
    }

    await record.save();
    res.status(200).json({
      success: true,
      message: "Progress updated successfully.",
      progress: record,
    });
  } catch (err) {
    console.error("Progress Update Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating progress",
      error: err.message,
    });
  }
};

// 🔹 Get progress for a specific course and user
export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const progress = await Progress.findOne({ user: userId, course: courseId })
      .populate("course", "title description")
      .populate("user", "name email");

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this course." });
    }

    res.status(200).json({ success: true, progress });
  } catch (err) {
    console.error("Fetch Progress Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching progress",
      error: err.message,
    });
  }
};

// 🎬 Auto-update video progress (called from frontend video player)
export const updateVideoProgress = async (req, res) => {
  try {
    const { user, course, watchedPercentage, timeSpent } = req.body;

    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required." });
    }

    let record = await Progress.findOne({ user, course });
    if (!record) record = new Progress({ user, course });

    // Keep highest watched percentage (avoid backward tracking)
    record.progress = Math.max(record.progress, watchedPercentage);
    record.time_spent += timeSpent || 0;
    record.last_accessed = Date.now();

    if (record.progress >= 100) record.completed = true;

    await record.save();
    res.status(200).json({
      success: true,
      message: "Video progress updated.",
      progress: record,
    });
  } catch (err) {
    console.error("Video Progress Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating video progress",
      error: err.message,
    });
  }
};

// 🧩 Auto-update quiz score after quiz submission
export const updateQuizScore = async (req, res) => {
  try {
    const { user, course, score } = req.body;

    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required." });
    }

    let record = await Progress.findOne({ user, course });
    if (!record) record = new Progress({ user, course });

    // Keep best score only (optional logic)
    record.score = Math.max(record.score, score);
    record.last_accessed = Date.now();

    await record.save();
    res.status(200).json({
      success: true,
      message: "Quiz score updated successfully.",
      progress: record,
    });
  } catch (err) {
    console.error("Quiz Score Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating quiz score",
      error: err.message,
    });
  }
};
