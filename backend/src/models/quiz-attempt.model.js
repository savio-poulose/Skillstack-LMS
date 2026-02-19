const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
    {
        questionIndex: { type: Number, required: true },
        selectedIndex: { type: Number, default: -1 }, // -1 means skipped / timed out
        correct: { type: Boolean, required: true },
    },
    { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        score: { type: Number, required: true },      // correct count
        total: { type: Number, required: true },       // total questions
        percentage: { type: Number, required: true },  // 0-100
        answers: [answerSchema],
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// One attempt record per student per quiz (upsert on retake)
quizAttemptSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
