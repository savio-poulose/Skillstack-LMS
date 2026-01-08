const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.cookies.token;  // <-- GET TOKEN FROM COOKIE

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
