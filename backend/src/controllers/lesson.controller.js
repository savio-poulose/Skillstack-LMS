// controllers/lesson.controller.js
const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");

exports.createLesson = async (req, res) => {
  try {
    const { title, youtubeUrl, description } = req.body;
    const { courseId } = req.params;

    // count lessons for ordering
    const lessonCount = await Lesson.countDocuments({
      course: courseId,
    });

    const lesson = await Lesson.create({
      course: courseId,
      title,
      youtubeUrl,
      description,
      order: lessonCount + 1,
    });

    // 🔥 UPDATE COURSE totalLessons
    await Course.findByIdAndUpdate(courseId, {
      totalLessons: lessonCount + 1,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
