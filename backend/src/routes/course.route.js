// routes/course.route.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

/**
 * ===============================
 * Teacher routes
 * ===============================
 */

// Create course
router.post("/", authMiddleware, createCourse);

// Teacher → My Courses
router.get("/teacher", authMiddleware, getTeacherCourses);

// Update course
router.put("/:id", authMiddleware, updateCourse);

// Delete course
router.delete("/:id", authMiddleware, deleteCourse);

/**
 * ===============================
 * Student / Public routes
 * ===============================
 */

// Student dashboard (published courses)
router.get("/", getAllCourses);

// Course detail
router.get("/:id", authMiddleware, getCourseById);

module.exports = router;
