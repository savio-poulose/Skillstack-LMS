module.exports = (req, res, next) => {
  // allow admins always
  if (req.user.role === "admin") return next();

  // only teachers can pass
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Only teachers can perform this action",
    });
  }

  // teacher must be approved
  if (!req.user.isApproved) {
    return res.status(403).json({
      message: "Admin approval required",
    });
  }

  next();
};
