const express = require("express");
const router = express.Router();

const {
  enrollInCourse,
  getMyEnrollments,
  getMyCourseDetail,
} = require("../controllers/enrollment.controller");

const { authMiddleware } = require("../middlewares/auth");

router.get("/my-courses", authMiddleware, getMyEnrollments);
router.post("/:courseId", authMiddleware, enrollInCourse);
router.get("/my-courses/:courseId",authMiddleware,getMyCourseDetail);



module.exports = router;
