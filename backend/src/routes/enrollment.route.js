const express = require("express");
const router = express.Router();

const {
  enrollInCourse,
  getMyEnrollments,
} = require("../controllers/enrollment.controller");

const { authMiddleware } = require("../middlewares/auth");

router.get("/my-courses", authMiddleware, getMyEnrollments);
router.post("/:courseId", authMiddleware, enrollInCourse);


module.exports = router;
