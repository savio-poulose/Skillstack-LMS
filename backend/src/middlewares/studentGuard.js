const User = require("../models/user.model");

const studentGuard = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.role === "student" && user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked by admin"
    });
  }

  next();
};

module.exports = studentGuard;
