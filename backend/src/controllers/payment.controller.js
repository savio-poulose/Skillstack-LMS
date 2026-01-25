const Payment = require("../models/payment.model");
const Course = require("../models/course.model");

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

    const payment = await Payment.create({
      student: studentId,
      course: courseId,
      amount: course.price,
      status: "success",
      method: "fake",
    });

    res.status(201).json({
      message: "Fake payment successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment failed",
    });
  }
};

module.exports = { fakePayment };
