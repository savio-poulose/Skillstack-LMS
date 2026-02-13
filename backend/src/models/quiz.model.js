const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (v) => v.length === 4,
  },
  correctIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true, // 🔥 generate ONCE
    },

    questions: [questionSchema],

    perQuestionTime: {
      type: Number,
      default: 30,
    },

    source: {
      type: String,
      default: "ai",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);