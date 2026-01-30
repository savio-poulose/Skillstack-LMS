const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  try {
    // Admin always allowed
    if (req.user.role === "admin") {
      return next();
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🚫 Blocked students only
    if (user.role === "student" && user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    // ❌ DO NOT check teacher approval here
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
