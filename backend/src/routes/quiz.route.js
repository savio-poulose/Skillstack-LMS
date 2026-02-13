const express = require("express");
const router = express.Router();

const Course = require("../models/course.model");
const Quiz = require("../models/quiz.model");

const { fetchPdfBuffer, extractPdfText } = require("../util/pdf");
const { generateQuizFromText } = require("../util/ai");

const authMiddleware = require("../middlewares/auth");
// const teacherOnly = require("../middlewares/teacherOnly");
router.post(
  "/courses/:id/quiz/ai-generate",
  authMiddleware,
  async (req, res) => {
    try {
      if (
        req.user.role !== "teacher" ||
        req.user.isApproved !== true
      ) {
        return res.status(403).json({
          message: "Teacher not approved by admin",
        });
      }

      const courseId = req.params.id;

      const existingQuiz = await Quiz.findOne({ courseId });
      if (existingQuiz) return res.json(existingQuiz);

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // 🔥 Instead of PDF → Use metadata
      const { generateQuizFromGemini } = require("../services/gemini.service");

      const aiQuestions = await generateQuizFromGemini(course);

      const quiz = await Quiz.create({
        courseId,
        questions: aiQuestions,
        perQuestionTime: 30,
        source: "ai",
      });

      res.json(quiz);

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Quiz generation failed",
      });
    }
  }
);
// GET quiz by course
router.get(
  "/courses/:id/quiz",
  authMiddleware,
  async (req, res) => {
    try {
      const quiz = await Quiz.findOne({ courseId: req.params.id });

      if (!quiz) {
        return res.status(404).json({ message: "No quiz found" });
      }

      res.json(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  }
);

module.exports = router;