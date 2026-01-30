const Course = require("../models/course.model");
const uploadToCloudinary = require("../util/uploadToCloudinary");

/**
 * CREATE COURSE (TEACHER ONLY)
 */
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    let thumbnailUrl = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "course_thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      level: req.body.level || "beginner",
      status: req.body.status || "draft",
      thumbnail: thumbnailUrl,
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET COURSES CREATED BY LOGGED-IN TEACHER
 */
exports.getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teacher courses" });
  }
};

/**
 * GET ALL COURSES FOR STUDENTS (ONLY PUBLISHED + ACTIVE)
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      status: "published",
      isActive: true,
    }).populate("createdBy", "name");

    res.json(courses);
  } catch (error) {
    console.error("GET ALL COURSES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/**
 * GET SINGLE COURSE FOR STUDENT (BLOCK DISABLED COURSES)
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not available" });
    }

    res.json(course);
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

/**
 * DELETE COURSE (TEACHER ONLY – OWN COURSE)
 */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

/**
 * UPDATE COURSE (TEACHER ONLY – OWN COURSE)
 */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    let thumbnailUrl = course.thumbnail;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "course_thumbnails"
      );
      thumbnailUrl = result.secure_url;
    }

    course.title = req.body.title ?? course.title;
    course.description = req.body.description ?? course.description;
    course.price = req.body.price ?? course.price;
    course.category = req.body.category ?? course.category;
    course.status = req.body.status ?? course.status;
    course.thumbnail = thumbnailUrl;

    await course.save();

    res.json(course);
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPLOAD COURSE PDF (TEACHER ONLY – OWN COURSE)
 */
exports.uploadCoursePdf = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "course_pdfs"
    );

    course.notesPdf = result.secure_url;
    await course.save();

    res.json({
      message: "PDF uploaded successfully",
      pdfUrl: course.notesPdf,
    });
  } catch (error) {
    console.error("PDF UPLOAD ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};
  