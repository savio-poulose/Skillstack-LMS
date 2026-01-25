const Course = require("../models/course.model");
const uploadToCloudinary = require("../util/uploadToCloudinary");

/**
 * CREATE COURSE
 */
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

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
      level: req.body.level || "begginer",
      status: req.body.status,
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
 * TEACHER COURSES
 */
exports.getTeacherCourses = async (req, res) => {
  const courses = await Course.find({ createdBy: req.user.id });
  res.json(courses);
};

/**
 * ALL PUBLISHED COURSES
 */
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find({ status: "published" })
    .populate("createdBy", "name");
  res.json(courses);
};

/**
 * SINGLE COURSE
 */
exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("createdBy", "name email");

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
};

/**
 * DELETE COURSE
 */
exports.deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Not found" });

  if (course.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not your course" });
  }

  await course.deleteOne();
  res.json({ message: "Course deleted" });
};

/**
 * UPDATE COURSE
 */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

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
 * UPLOAD COURSE PDF
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
