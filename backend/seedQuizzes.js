import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Course from "./models/Course.js";
import Quiz from "./models/Quiz.js"; // you'll create this

dotenv.config();
connectDB();

const seedQuizzes = async () => {
  try {
    await Quiz.deleteMany();

    const courses = await Course.find({});
    if (!courses.length) {
      console.log("❌ No courses found! Run seedCourses.js first.");
      process.exit(1);
    }

    const quizzes = {
      "Data Science": [
        {
          question: "Which library is commonly used for data analysis in Python?",
          options: ["NumPy", "Pandas", "Matplotlib", "TensorFlow"],
          answer: "Pandas",
        },
        {
          question: "Which type of learning requires labeled data?",
          options: ["Unsupervised", "Supervised", "Reinforcement", "None"],
          answer: "Supervised",
        },
        {
          question: "Which of these is used for visualization?",
          options: ["Pandas", "Matplotlib", "Scikit-learn", "TensorFlow"],
          answer: "Matplotlib",
        },
      ],

      "English Vocabulary": [
        {
          question: "What is the synonym of 'happy'?",
          options: ["Sad", "Joyful", "Angry", "Tired"],
          answer: "Joyful",
        },
        {
          question: "Choose the correct spelling:",
          options: ["Definately", "Definitely", "Definetely", "Definitaly"],
          answer: "Definitely",
        },
        {
          question: "What is the antonym of 'strong'?",
          options: ["Powerful", "Weak", "Big", "Smart"],
          answer: "Weak",
        },
      ],

      "Advanced Physics": [
        {
          question: "Who formulated the theory of relativity?",
          options: ["Einstein", "Newton", "Bohr", "Planck"],
          answer: "Einstein",
        },
        {
          question: "Quantum mechanics deals with?",
          options: ["Planets", "Subatomic particles", "Stars", "Atoms only"],
          answer: "Subatomic particles",
        },
        {
          question: "What is the SI unit of force?",
          options: ["Joule", "Newton", "Pascal", "Watt"],
          answer: "Newton",
        },
      ],
    };

    for (const course of courses) {
      const quizData = quizzes[course.title];
      if (quizData) {
        await Quiz.create({
          course: course._id,
          questions: quizData,
        });
        console.log(`✅ Quiz added for course: ${course.title}`);
      } else {
        console.log(`⚠️ No quiz found for: ${course.title}`);
      }
    }

    console.log("✅ All quizzes seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding quizzes:", err);
    process.exit(1);
  }
};

seedQuizzes();
