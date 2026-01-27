const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const Payment = require("../models/payment.model");
const Lesson = require("../models/lesson.model");

/* =========================
   ENROLL IN COURSE
========================= */
const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // FREE COURSE
    if (course.price === 0) {
      const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        paymentStatus: "free",
      });

      return res.status(201).json({
        message: "Enrolled in free course",
        enrollment,
      });
    }

    // PAID COURSE
    const payment = await Payment.findOne({
      student: studentId,
      course: courseId,
      status: "success",
    });

    if (!payment) {
      return res.status(403).json({
        message: "Payment required",
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      paymentStatus: "paid",
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Already enrolled in this course",
      });
    }

    res.status(500).json({
      message: "Enrollment failed",
    });
  }
};

/* =========================
   GET MY ENROLLMENTS
========================= */
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({
      student: studentId,
    }).populate("course");

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};

/* =========================
   GET COURSE DETAIL (LEARN PAGE)
========================= */
const getMyCourseDetail = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate("course");

    if (!enrollment || !enrollment.course) {
      return res.status(404).json({
        message: "Not enrolled in this course",
      });
    }

    res.status(200).json({
      course: enrollment.course,
      progress: enrollment.progress || 0,
      completedLessons: enrollment.completedLessons || [],
    });
  } catch (error) {
    console.error("getMyCourseDetail error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* =========================
   COMPLETE LESSON (PROGRESS)
========================= */
const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    if (!Array.isArray(enrollment.completedLessons)) {
      enrollment.completedLessons = [];
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);

      const totalLessons = await Lesson.countDocuments({
        course: courseId,
      });

      enrollment.progress =
        totalLessons === 0
          ? 0
          : Math.round(
              (enrollment.completedLessons.length / totalLessons) * 100
            );

      await enrollment.save();
    }

    res.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
    });
  } catch (err) {
    console.error("❌ completeLesson error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getMyCourseDetail,
  completeLesson,
};
