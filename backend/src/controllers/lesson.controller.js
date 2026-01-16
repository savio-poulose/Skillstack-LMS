const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");

// CREATE
exports.createLesson = async (req, res) => {
  try {
    const { title, youtubeUrl, description } = req.body;
    const { courseId } = req.params;

    if (!title || !youtubeUrl) {
      return res
        .status(400)
        .json({ message: "Title and YouTube URL required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    const lessonCount = await Lesson.countDocuments({ course: courseId });

    const lesson = await Lesson.create({
      course: courseId,
      title,
      youtubeUrl,
      description,
      order: lessonCount + 1,
    });

    await Course.findByIdAndUpdate(courseId, {
      totalLessons: lessonCount + 1,
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

// READ
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findById(lesson.course);
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    lesson.title = req.body.title ?? lesson.title;
    lesson.youtubeUrl = req.body.youtubeUrl ?? lesson.youtubeUrl;
    lesson.description = req.body.description ?? lesson.description;

    await lesson.save();
    res.json(lesson);
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const course = await Course.findById(lesson.course);
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    await lesson.deleteOne();

    const lessons = await Lesson.find({ course: lesson.course }).sort({
      order: 1,
    });

    for (let i = 0; i < lessons.length; i++) {
      lessons[i].order = i + 1;
      await lessons[i].save();
    }

    await Course.findByIdAndUpdate(lesson.course, {
      totalLessons: lessons.length,
    });

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};
