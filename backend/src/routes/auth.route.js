const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/auth.controllers");
const { authMiddleware } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/login", loginUser);


//checking status
router.get("/check", authMiddleware, (req, res) => {
  res.json({
    loggedIn: true,
    role: req.user.role
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});


module.exports = router;