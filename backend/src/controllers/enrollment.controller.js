const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const Payment = require("../models/payment.model");

const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

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

const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course");

    res.json(enrollments);
  } catch {
    res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};

const getMyCourseDetail = async (req, res) => {
  try {
    // console.log("👉 getMyCourseDetail called");
    // console.log("user:", req.user);
    // console.log("courseId:", req.params.courseId);

    const studentId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate("course");

    // console.log("enrollment:", enrollment);

    if (!enrollment || !enrollment.course) {
      return res.status(404).json({
        message: "Not enrolled in this course",
      });
    }

    // 🔥 THIS IS WHERE IT LIKELY CRASHES
    if (enrollment.course.lessons) {
      await enrollment.course.populate("lessons");
    }

    res.status(200).json({
      course: enrollment.course,
      progress: enrollment.progress || 0,
    });
  } catch (error) {
    console.error("❌ BACKEND CRASH:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getMyCourseDetail
};
