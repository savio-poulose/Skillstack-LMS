const { generateQuizFromGemini } = require("../services/gemini.service");
const Quiz = require("../models/quiz.model");
const Course = require("../models/course.model");

exports.generateQuizWithAI = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1️⃣ Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Check if quiz already exists (important because unique: true)
    const existingQuiz = await Quiz.findOne({ courseId });
    if (existingQuiz) {
      return res.status(400).json({ message: "Quiz already generated" });
    }

    // 3️⃣ Call Gemini
    const aiResponse = await generateQuizFromGemini(course);

    // 4️⃣ Validate AI response
    const isValid = aiResponse.every(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid AI response format" });
    }

    // 5️⃣ Save quiz
    const quiz = await Quiz.create({
      courseId,
      questions: aiResponse,
      perQuestionTime: 30,
      source: "ai",
    });

    res.status(201).json(quiz);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};