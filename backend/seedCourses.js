import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "your_mongo_atlas_connection_string_here";

const seedCourses = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding");

    // Remove old data
    await Course.deleteMany();

    // Add fresh demo courses (with prices)
    const courses = [
      {
        title: "Data Science",
        category: "Coding",
        description:
          "Learn data analysis, visualization, and machine learning using Python and real-world projects.",
        duration: 20,
        level: "Intermediate",
        image: "https://img-c.udemycdn.com/course/480x270/903744_8eb2.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        notes: "http://localhost:5000/notes/datascience.pdf",
        price: 1499,
        whatYouWillLearn: [
          "Data cleaning and visualization",
          "Machine learning algorithms",
          "Handling large datasets",
          "Data-driven decision making",
        ],
        syllabus: [
          "Python for Data Science",
          "Statistics and Probability",
          "Machine Learning Fundamentals",
          "Visualization Tools",
          "Capstone Project",
        ],
      },
      {
        title: "English Vocabulary",
        category: "Language",
        description:
          "Enhance your English communication and vocabulary for academic and professional growth.",
        duration: 10,
        level: "Beginner",
        image: "https://img-c.udemycdn.com/course/480x270/1869130_5bfc.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1U3rjZpR2Ns",
        notes: "http://localhost:5000/notes/englishvac.pdf",
        price: 699,
        whatYouWillLearn: [
          "Improve English speaking and writing",
          "Learn word usage and grammar",
          "Practice pronunciation and comprehension",
          "Enhance confidence in communication",
        ],
        syllabus: [
          "Common Vocabulary",
          "Grammar Essentials",
          "Conversational English",
          "Business English",
          "Final Assessment",
        ],
      },
      {
        title: "Advanced Physics",
        category: "Science",
        description:
          "Explore the core principles of modern physics including quantum mechanics and relativity.",
        duration: 16,
        level: "Advanced",
        image: "https://img-c.udemycdn.com/course/480x270/1680662_066e.jpg",
        videoUrl: "https://www.youtube.com/watch?v=5MfSYnItYvg",
        notes: "http://localhost:5000/notes/advancephysics.pdf",
        price: 1299,
        whatYouWillLearn: [
          "Newtonian and Quantum Physics",
          "Thermodynamics",
          "Waves and Optics",
          "Relativity and Nuclear Physics",
        ],
        syllabus: [
          "Classical Physics Review",
          "Modern Physics Concepts",
          "Quantum Mechanics",
          "Special Relativity",
          "Applied Physics Project",
        ],
      },
      {
        title: "Chemistry Basics",
        category: "Science",
        description:
          "Understand chemical reactions, equations, and atomic structures from scratch.",
        duration: 12,
        level: "Beginner",
        image: "https://img-c.udemycdn.com/course/480x270/1678712_9b4f_2.jpg",
        videoUrl: "https://www.youtube.com/watch?v=FSyAehMdpyI",
        notes: "http://localhost:5000/notes/chemistrybasic.pdf",
        price: 899,
        whatYouWillLearn: [
          "Atomic structure and bonding",
          "Periodic table fundamentals",
          "Chemical equations and reactions",
          "Practical lab-based chemistry",
        ],
        syllabus: [
          "Atoms and Molecules",
          "Chemical Bonding",
          "Acids and Bases",
          "Organic Chemistry Basics",
          "Practical Applications",
        ],
      },
      {
        title: "Marketing Basics",
        category: "Business",
        description:
          "Understand the core principles of marketing, branding, and customer engagement.",
        duration: 8,
        level: "Beginner",
        image: "https://img-c.udemycdn.com/course/480x270/567830_67d0.jpg",
        videoUrl: "https://www.youtube.com/watch?v=0TFrqBz1gAQ",
        notes: "https://assets.openstax.org/oscms-prodcms/media/documents/Principles_Marketing-WEB.pdf",
        price: 999,
        whatYouWillLearn: [
          "Fundamentals of marketing",
          "Digital marketing tools",
          "Brand positioning",
          "Consumer behavior insights",
        ],
        syllabus: [
          "Introduction to Marketing",
          "Digital Marketing Channels",
          "Social Media Marketing",
          "Brand Strategy",
          "Marketing Case Study",
        ],
      },
      {
        title: "Physics Basics",
        category: "Science",
        description:
          "Learn the foundational concepts of physics to prepare for higher-level courses.",
        duration: 10,
        level: "Beginner",
        image: "https://img-c.udemycdn.com/course/480x270/4514764_f730.jpg",
        videoUrl: "https://www.youtube.com/watch?v=VnnpLaKsqGU",
        notes: "https://openstax.org/resources/4b2b2a5e-5d83-42f9-8d2a-efc1db90f9b9/college-physics-2e.pdf",
        price: 799,
        whatYouWillLearn: [
          "Motion and Forces",
          "Energy and Work",
          "Electricity and Magnetism",
          "Light and Sound",
        ],
        syllabus: [
          "Mechanics",
          "Thermodynamics",
          "Electricity and Magnetism",
          "Waves and Optics",
          "Lab Experiments",
        ],
      },
      {
        title: "Basic Math",
        category: "Math",
        description:
          "Master the fundamental mathematical concepts for everyday and academic use.",
        duration: 8,
        level: "Beginner",
        image: "https://img-c.udemycdn.com/course/480x270/2329080_6fbd.jpg",
        videoUrl: "https://www.youtube.com/watch?v=1HqjP9O4IQE",
        notes: "https://openstax.org/resources/8a563d42-7f14-47bb-bf70-f09c5f2785a3/algebra-and-trigonometry-2e.pdf",
        price: 699,
        whatYouWillLearn: [
          "Arithmetic operations",
          "Fractions and decimals",
          "Percentages and ratios",
          "Introduction to algebra",
        ],
        syllabus: [
          "Number Systems",
          "Arithmetic Operations",
          "Basic Algebra",
          "Word Problems",
          "Final Test",
        ],
      },
    ];

    await Course.insertMany(courses);
    console.log("✅ Courses seeded successfully with prices!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();
