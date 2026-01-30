module.exports = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({ message: "Teacher not approved" });
  }

  next();
};
