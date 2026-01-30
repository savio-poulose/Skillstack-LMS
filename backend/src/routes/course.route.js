const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const teacherApproved = require("../middlewares/teacherApproved.middleware");
const upload = require("../middlewares/multer");
const uploadPdf = require("../middlewares/pdfUpload");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  uploadCoursePdf,
} = require("../controllers/course.controller");

// ✅ CREATE COURSE (ONLY APPROVED TEACHERS)
router.post(
  "/",
  authMiddleware,
  teacherApproved,              // 🔥 REQUIRED
  upload.single("thumbnail"),
  createCourse
);

// ✅ TEACHER → MY COURSES
router.get(
  "/teacher",
  authMiddleware,
  teacherApproved,
  getTeacherCourses
);

// ✅ UPDATE COURSE
router.put(
  "/:id",
  authMiddleware,
  teacherApproved,
  upload.single("thumbnail"),
  updateCourse
);

// ✅ DELETE COURSE
router.delete(
  "/:id",
  authMiddleware,
  teacherApproved,
  deleteCourse
);

// STUDENT DASHBOARD (PUBLIC)
router.get("/", getAllCourses);

// COURSE DETAIL
router.get("/:id", authMiddleware, getCourseById);

// ✅ UPLOAD PDF (ONLY APPROVED TEACHERS)
router.put(
  "/:id/pdf",
  authMiddleware,
  teacherApproved,
  uploadPdf.single("pdf"),
  uploadCoursePdf
);

module.exports = router;
