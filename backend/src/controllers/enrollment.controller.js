const Enrollment = require("../models/enrollment.model");

/**
 * POST /api/enroll/:courseId
 */
exports.enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.id;   // auth middleware
    const { courseId } = req.params;

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    // duplicate enrollment
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

/**
 * GET /api/enroll/my-courses
 */
exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate("course");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};
