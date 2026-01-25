const express = require("express");
const router = express.Router();

const { fakePayment } = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth");

router.post("/fake/:courseId", authMiddleware, fakePayment);

module.exports = router;
