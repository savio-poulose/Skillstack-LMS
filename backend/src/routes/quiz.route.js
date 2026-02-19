const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const {
  generateQuiz,
  getQuizByCourse,
  getAvailableQuizzes,
  getStudentQuiz,
  submitQuiz,
  getMyAttempt,
} = require("../controllers/quiz.controller");

// Teacher generates quiz
router.post(
  "/courses/:id/quiz/ai-generate",
  authMiddleware,
  generateQuiz
);

// Get quiz by course ID (General use / Teacher view)
router.get(
  "/courses/:id/quiz",
  authMiddleware,
  getQuizByCourse
);

// STUDENT ROUTES
router.get(
  "/student/quizzes/available",
  authMiddleware,
  getAvailableQuizzes
);

router.get(
  "/student/quiz/:quizId",
  authMiddleware,
  getStudentQuiz
);

router.post(
  "/student/quiz/:quizId/submit",
  authMiddleware,
  submitQuiz
);

router.get(
  "/student/quiz/:quizId/attempt",
  authMiddleware,
  getMyAttempt
);

module.exports = router;