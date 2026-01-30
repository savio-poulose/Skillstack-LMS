const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    thumbnail: String,

    price: { type: Number, default: 0 },
    category: { type: String, required: true },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    notesPdf: {
      type: String,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    enrolledCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    totalLessons: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

courseSchema.index({ createdBy: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model("Course", courseSchema);
