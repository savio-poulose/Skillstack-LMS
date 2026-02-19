const express = require("express");
const upload = require("../middlewares/multer");
const authMiddleware = require("../middlewares/auth");
const { getProfile, updateProfile } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authMiddleware, getProfile);

router.put(
  "/me",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);

module.exports = router;
