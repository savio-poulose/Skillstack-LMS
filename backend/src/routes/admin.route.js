const express = require("express");
const User = require("../models/user.model");
const Course = require("../models/course.model");

const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin.middleware");


const router = express.Router();

/**
 * GET all teachers
 */
router.get(
  "/teachers",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const teachers = await User.find({ role: "teacher" }).select("-password");
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  }
);

/**
 * APPROVE / BLOCK teacher
 */
router.patch(
  "/teachers/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { isApproved } = req.body;

      const teacher = await User.findById(req.params.id);

      if (!teacher || teacher.role !== "teacher") {
        return res.status(404).json({ message: "Teacher not found" });
      }

      teacher.isApproved = isApproved;
      await teacher.save();

      res.json({ message: "Teacher updated", teacher });
    } catch (err) {
      res.status(500).json({ message: "Failed to update teacher" });
    }
  }
);

/**
 * GET all students
 */
router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const students = await User.find({ role: "student" }).select("-password");
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  }
);

/**
 * BLOCK / UNBLOCK student
 */
router.patch(
  "/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { isBlocked } = req.body;

      const student = await User.findById(req.params.id);

      if (!student || student.role !== "student") {
        return res.status(404).json({ message: "Student not found" });
      }

      student.isBlocked = isBlocked;
      await student.save();

      res.json({ message: "Student updated", student });
    } catch (err) {
      res.status(500).json({ message: "Failed to update student" });
    }
  }
);

/**
 * GET all courses
 */
router.get(
  "/courses",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const courses = await Course.find()
        .populate("createdBy", "name email"); // ✅ FIXED
      res.json(courses);
    } catch (err) {
      console.error("ADMIN COURSES ERROR:", err);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  }
);

/**
 * ENABLE / DISABLE course
 */
router.patch(
  "/courses/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { isActive } = req.body;

      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      course.isActive = isActive;
      await course.save();

      res.json({ message: "Course updated", course });
    } catch (err) {
      res.status(500).json({ message: "Failed to update course" });
    }
  }
);

module.exports = router;
