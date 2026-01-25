const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },

    method: {
      type: String,
      enum: ["fake", "razorpay"],
      default: "fake",
    },
  },
  { timestamps: true }
);
paymentSchema.index({ student: 1, course: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
