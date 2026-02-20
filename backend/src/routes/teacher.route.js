const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const { getTeacherEarnings,getTeacherPayments } = require("../controllers/teacher.controller");

router.get("/earnings", authMiddleware, getTeacherEarnings);
router.get("/payments", authMiddleware, getTeacherPayments);

module.exports = router;