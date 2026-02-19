const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    getMyTeachers,
    getMyStudents,
    getHistory,
    markRead,
} = require("../controllers/chat.controller");

// Student: list teachers of enrolled courses
router.get("/chat/teachers", auth, getMyTeachers);

// Teacher: list students enrolled in their courses
router.get("/chat/students", auth, getMyStudents);

// Both: message history with specific user
router.get("/chat/:userId", auth, getHistory);

// Both: mark messages from a user as read
router.put("/chat/:userId/read", auth, markRead);

module.exports = router;
