const Course = require("../models/course.model");

/**
 * ===============================
 * CREATE COURSE (Teacher only)
 * ===============================
 */
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create course" });
  }
};

/**
 * ===============================
 * GET COURSES CREATED BY TEACHER
 * (Teacher → My Courses)
 * ===============================
 */
exports.getTeacherCourses = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const courses = await Course.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch teacher courses" });
  }
};

/**
 * ===============================
 * GET ALL PUBLISHED COURSES
 * (Student dashboard)
 * ===============================
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/**
 * ===============================
 * GET SINGLE COURSE
 * (Student / Teacher)
 * ===============================
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Students should not access draft courses
    if (
      course.status === "draft" &&
      req.user.role === "student"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid course ID" });
  }
};

/**
 * ===============================
 * UPDATE COURSE (Teacher only)
 * ===============================
 */
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ownership check
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update course" });
  }
};

/**
 * ===============================
 * DELETE COURSE (Teacher only)
 * ===============================
 */
exports.deleteCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ownership check
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
