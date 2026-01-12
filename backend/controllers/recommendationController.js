import axios from "axios";

export const getRecommendation = async (req, res) => {
  try {
    const { course_name, category, progress, score } = req.body;

    // Send data to Flask ML service
    const response = await axios.post("http://localhost:5001/predict", {
      course_name,
      category,
      progress,
      score,
    });

    res.json({ recommended_course: response.data.recommended_course });
  } catch (err) {
    console.error("Recommendation Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Error fetching recommendation" });
  }
};
