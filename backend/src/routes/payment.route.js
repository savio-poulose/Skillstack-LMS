const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const { fakePayment } = require("../controllers/payment.controller");

router.post("/fake/:courseId", authMiddleware, fakePayment);

module.exports = router;
