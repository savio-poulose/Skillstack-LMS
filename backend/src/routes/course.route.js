// routes/course.route.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const uploadPdf = require("../middlewares/pdfUpload");
const { uploadCoursePdf } = require("../controllers/course.controller");


const {
  createCourse,
  getAllCourses,
  getCourseById,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");


// Create course (WITH thumbnail upload)
router.post(
  "/",
  authMiddleware,
  upload.single("thumbnail"), // 🔥 THIS LINE IS MANDATORY
  createCourse
);


// Teacher → My Courses
router.get("/teacher", authMiddleware, getTeacherCourses);

// Update course (optional thumbnail update)
router.put(
  "/:id",
  authMiddleware,
  upload.single("thumbnail"),
  updateCourse
);

// Delete course
router.delete("/:id", authMiddleware, deleteCourse);



// Student dashboard (published courses)
router.get("/", getAllCourses);

// Course detail
router.get("/:id", authMiddleware, getCourseById);


router.put(
  "/:id/pdf",
  authMiddleware,
  uploadPdf.single("pdf"),
  uploadCoursePdf
);


module.exports = router;
