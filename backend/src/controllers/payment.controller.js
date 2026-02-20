const Payment = require("../models/payment.model");
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");

const COMMISSION_RATE = 0.2;

/**
 * POST /api/payments/fake/:courseId
 */
const fakePayment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.price === 0) {
      return res.status(400).json({
        message: "This course is free. No payment needed.",
      });
    }

    // 🚨 IMPORTANT: make sure course has createdBy
    if (!course.createdBy) {
      return res.status(400).json({
        message: "Course has no teacher assigned.",
      });
    }

    // Prevent duplicate purchase
    const existingPayment = await Payment.findOne({
      student: studentId,
      course: courseId,
      status: "success",
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "You already purchased this course.",
      });
    }

    // Revenue split
    const adminAmount = course.price * COMMISSION_RATE;
    const teacherAmount = course.price - adminAmount;

    // 💳 Create Payment
    const payment = await Payment.create({
      student: studentId,
      course: courseId,
      teacher: course.createdBy, // 🔥 FIXED HERE
      amount: course.price,
      teacherAmount,
      adminAmount,
      status: "success",
      method: "fake",
    });

    // 🎓 Create Enrollment
    await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    res.status(201).json({
      message: "Fake payment successful",
      payment,
    });

  } catch (error) {
    console.error("FAKE PAYMENT ERROR:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

module.exports = { fakePayment };