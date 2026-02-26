import Course from "../models/Course.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get course by ID
// Get single course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add course (admin only)
export const addCourse = async (req, res) => {
  const { title, category, description, duration, image } = req.body;
  try {
    const course = await Course.create({ title, category, description, duration, image });
    res.status(201).json({ course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
