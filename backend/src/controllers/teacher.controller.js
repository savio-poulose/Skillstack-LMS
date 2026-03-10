const Payment = require("../models/payment.model");
const Feedback = require("../models/feedback.model");
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");


/* =========================
   TEACHER EARNINGS
========================= */

const getTeacherEarnings = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const payments = await Payment.find({
      teacher: teacherId,
      status: "success",
    });

    let totalEarnings = 0;

    payments.forEach((p) => {
      totalEarnings += p.teacherAmount;
    });

    res.json({
      totalEarnings,
      totalSales: payments.length,
    });

  } catch (error) {
    console.error("Earnings error:", error);
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
};


/* =========================
   TEACHER PAYMENTS
========================= */

const getTeacherPayments = async (req, res) => {
  try {

    const teacherId = req.user.id;

    const payments = await Payment.find({
      teacher: teacherId,
      status: "success",
    })
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(payments);

  } catch (error) {
    console.error("Payments fetch error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};


/* =========================
   TEACHER FEEDBACK
========================= */
const getTeacherFeedback = async (req, res) => {
  try {

    // console.log(req.params.teacherId)
    const teacherId = req.params.teacherId;
    // console.log(teacherId)

    // Find courses created by this teacher
    const courses = await Course.find({ createdBy: teacherId });
    // console.log("courses:"+courses)

    const courseIds = courses.map(c => c._id);
    // console.log("courseid:"+courseIds)

    // Find feedback for those courses
    const feedback = await Feedback.find({
      course: { $in: courseIds }
    })
      .populate("user", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json(feedback);
    console.log("feedbak"+ feedback)

  } catch (error) {
    console.error("Teacher feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

const getTeacherEnrollments = async (req, res) => {
  try {

    const teacherId = req.user.id;

    const courses = await Course.find({ createdBy: teacherId });

    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds }
    })
      .populate("student", "name email")
      .populate("course", "title");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enrollments"
    });
  }
};

module.exports = {
  getTeacherEarnings,
  getTeacherPayments,
  getTeacherFeedback,
  getTeacherEnrollments
};