const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");

const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");

// Create lesson
router.post(
  "/courses/:courseId/lessons",
  authMiddleware,
  createLesson
);

// Get lessons of a course
router.get(
  "/courses/:courseId/lessons",
  authMiddleware,
  getLessonsByCourse
);

// Update a lesson
router.put(
  "/lessons/:lessonId",
  authMiddleware,
  updateLesson
);

// Delete a lesson
router.delete(
  "/lessons/:lessonId",
  authMiddleware,
  deleteLesson
);

module.exports = router;
