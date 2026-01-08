const express = require("express");
const router = express.Router();

const {
  enrollInCourse,
  getMyEnrollments,
} = require("../controllers/enrollment.controller");

const { authMiddleware } = require("../middlewares/auth");

router.post("/:courseId", authMiddleware, enrollInCourse);
router.get("/my-courses", authMiddleware, getMyEnrollments);

module.exports = router;
