const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");

const {
  getTeacherEarnings,
  getTeacherPayments,
  getTeacherFeedback
} = require("../controllers/teacher.controller");

router.get("/earnings", authMiddleware, getTeacherEarnings);
router.get("/payments", authMiddleware, getTeacherPayments);
router.get("/feedback/:teacherId", authMiddleware, getTeacherFeedback);

module.exports = router;