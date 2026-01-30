const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const accountStatus = require("../middlewares/accountStatus.middleware");

const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");

const {
  getMe,
  updateMe,
} = require("../controllers/userController");

// 🔓 PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔒 PROTECTED ROUTES
router.get("/me", authMiddleware, accountStatus, getMe);
router.patch("/me", authMiddleware, accountStatus, updateMe);

module.exports = router;
