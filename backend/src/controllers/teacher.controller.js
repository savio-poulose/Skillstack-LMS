const Payment = require("../models/payment.model");

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

module.exports = { getTeacherEarnings,getTeacherPayments };