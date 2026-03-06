const express = require("express");
const router = express.Router();

const Feedback = require("../models/feedback.model");
const Enrollment = require("../models/enrollment.model");
const Lesson = require("../models/lesson.model");

const authMiddleware = require("../middlewares/auth");

/* =========================
   CHECK IF USER SUBMITTED
========================= */

router.get("/my/:courseId", authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      user: req.user.id,
      course: req.params.courseId,
    });

    res.json({ submitted: !!feedback });
  } catch (error) {
    console.error("Feedback check error:", error);
    res.status(500).json({ message: "Error checking feedback" });
  }
});

/* =========================
   CREATE FEEDBACK
========================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    // 1️⃣ Check enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id, // ✅ IMPORTANT FIX
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    // 2️⃣ Calculate progress dynamically
    const totalLessons = await Lesson.countDocuments({
      course: courseId,
    });

    const completedLessons = enrollment.completedLessons?.length || 0;

    const progress =
      totalLessons === 0
        ? 0
        : Math.floor((completedLessons / totalLessons) * 100);

    if (progress < 100) {
      return res.status(403).json({
        message: "Complete the course to give feedback",
      });
    }

    // 3️⃣ Prevent duplicate feedback
    const existingFeedback = await Feedback.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (existingFeedback) {
      return res.status(400).json({
        message: "You already submitted feedback",
      });
    }

    // 4️⃣ Create feedback
    const feedback = await Feedback.create({
      user: req.user.id,
      course: courseId,
      rating,
      comment,
    });

    res.json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    console.error("Feedback creation error:", error);
    res.status(500).json({ message: "Feedback failed" });
  }
});

/* =========================
   GET ALL FEEDBACK FOR COURSE
========================= */

router.get("/course/:courseId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      course: req.params.courseId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error("Fetch feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

module.exports = router;