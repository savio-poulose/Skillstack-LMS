const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    notesPdf: {
      type: String,
      default: null,
    },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
