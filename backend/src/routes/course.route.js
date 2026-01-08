// routes/course.routes.js
const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
} = require("../controllers/course.controller");

// TEMP – create course via Postman
router.post("/", createCourse);

// Student dashboard
router.get("/", getAllCourses);

// Course detail
router.get("/:id", getCourseById);

module.exports = router;
