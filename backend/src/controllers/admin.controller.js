const Payment = require("../models/payment.model");

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
          totalRevenue: { $sum: "$adminAmount" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    res.json(result[0] || { totalRevenue: 0, totalTransactions: 0 });

  } catch (error) {
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

module.exports = {
  getAdminWallet,
  getAllPayments,
};