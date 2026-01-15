// routes/lesson.routes.js
const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessonsByCourse,
} = require("../controllers/lesson.controller");

router.post("/courses/:courseId/lessons", createLesson);
router.get("/courses/:courseId/lessons", getLessonsByCourse);

module.exports = router;
