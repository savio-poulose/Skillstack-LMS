const Course = require("../models/course.model");
const Quiz = require("../models/quiz.model");
const Enrollment = require("../models/enrollment.model");
const QuizAttempt = require("../models/quiz-attempt.model");
const { generateQuizFromGemini } = require("../services/gemini.service");

const generateQuiz = async (req, res) => {
  try {
    if (req.user.role !== "teacher" || req.user.isApproved !== true) {
      return res.status(403).json({
        message: "Teacher not approved by admin",
      });
    }

    const courseId = req.params.id;

    const existingQuiz = await Quiz.findOne({ courseId });
    if (existingQuiz) return res.json(existingQuiz);

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const aiQuestions = await generateQuizFromGemini(course);

    const quiz = await Quiz.create({
      courseId,
      questions: aiQuestions,
      perQuestionTime: 30,
      source: "ai",
    });

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Quiz generation failed",
    });
  }
};

const getQuizByCourse = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.id });

    if (!quiz) {
      return res.status(404).json({ message: "No quiz found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

const getAvailableQuizzes = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
      progress: { $gte: 100 },
    }).populate("course");

    if (!enrollments.length) {
      return res.json([]);
    }

    const completedCourseIds = enrollments.map((e) => e.course._id);

    const quizzes = await Quiz.find({
      courseId: { $in: completedCourseIds },
    });

    const quizIds = quizzes.map((q) => q._id);
    const attempts = await QuizAttempt.find({
      studentId: req.user.id,
      quizId: { $in: quizIds },
    });

    const result = quizzes.map((quiz) => {
      const enrollment = enrollments.find(
        (e) => e.course._id.toString() === quiz.courseId.toString()
      );
      const attempt = attempts.find(
        (a) => a.quizId.toString() === quiz._id.toString()
      );
      return {
        _id: quiz._id,
        courseTitle: enrollment.course.title,
        courseThumbnail: enrollment.course.thumbnail,
        courseId: quiz.courseId,
        questionsCount: quiz.questions.length,
        perQuestionTime: quiz.perQuestionTime,
        attempted: !!attempt,
        bestScore: attempt ? attempt.score : null,
        bestPercentage: attempt ? attempt.percentage : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("GET AVAILABLE QUIZZES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch available quizzes" });
  }
};

const getStudentQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: quiz.courseId,
      progress: { $gte: 100 },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You have not completed this course yet." });
    }

    res.json(quiz);
  } catch (err) {
    console.error("GET STUDENT QUIZ ERROR:", err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: quiz.courseId,
      progress: { $gte: 100 },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You have not completed this course yet." });
    }

    let score = 0;
    const gradedAnswers = answers.map((ans) => {
      const question = quiz.questions[ans.questionIndex];
      const isCorrect =
        question && ans.selectedIndex === question.correctIndex;
      if (isCorrect) score++;
      return {
        questionIndex: ans.questionIndex,
        selectedIndex: ans.selectedIndex ?? -1,
        correct: isCorrect,
      };
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const attempt = await QuizAttempt.findOneAndUpdate(
      { quizId, studentId: req.user.id },
      {
        score,
        total,
        percentage,
        answers: gradedAnswers,
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ score, total, percentage, attemptId: attempt._id });
  } catch (err) {
    console.error("SUBMIT QUIZ ERROR:", err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};

const getMyAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempt = await QuizAttempt.findOne({
      quizId,
      studentId: req.user.id,
    });

    res.json(attempt || null);
  } catch (err) {
    console.error("GET MY ATTEMPT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch attempt" });
  }
};

module.exports = {
  generateQuiz,
  getQuizByCourse,
  getAvailableQuizzes,
  getStudentQuiz,
  submitQuiz,
  getMyAttempt,
};