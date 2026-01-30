const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },

  age: {
    type: Number,
    required: true,
    min: 10,
    max: 100,
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student",
  },

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === "student";
    },
  },

  avatar: {
    type: String,
    default: "",
  },
  isBlocked: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model("User", userSchema);
