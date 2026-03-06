const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");

/**
 * GET /api/admin/wallet
 */
const getAdminWallet = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          totalPlatformRevenue: { $sum: "$amount" },
          totalTeacherPayout: { $sum: "$teacherAmount" },
          totalAdminCommission: { $sum: "$adminAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    res.json(
      result[0] || {
        totalPlatformRevenue: 0,
        totalTeacherPayout: 0,
        totalAdminCommission: 0,
        totalTransactions: 0,
      }
    );
  } catch (error) {
    console.error("Admin wallet error:", error);
    res.status(500).json({ message: "Failed to fetch wallet" });
  }
};

/**
 * GET /api/admin/payments
 */
const getAllPayments = async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = { status: "success" };

    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const payments = await Payment.find(filter)
      .populate("student", "name email")
      .populate("teacher", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.json(payments);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

const getTeacherEarnings = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: "$teacher",
          totalEarned: { $sum: "$teacherAmount" },
          totalSales: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      {
        $project: {
          teacherId: "$teacher._id",
          name: "$teacher.name",
          email: "$teacher.email",
          totalEarned: 1,
          totalSales: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error("Teacher earnings error:", error);
    res.status(500).json({ message: "Failed to fetch teacher earnings" });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    const pendingApprovals = await User.countDocuments({
      role: "teacher",
      isApproved: false,
    });

    const totalCourses = await Course.countDocuments();

    const recentTeachers = await User.find({ role: "teacher" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email isApproved");

    res.json({
      totalTeachers,
      pendingApprovals,
      totalCourses,
      recentTeachers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

module.exports = {
  getAdminWallet,
  getAllPayments,
  getTeacherEarnings,
  getAdminStats
};