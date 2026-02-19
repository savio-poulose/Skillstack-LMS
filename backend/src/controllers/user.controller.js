const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");

/**
 * GET profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * UPDATE profile (details + optional profile pic)
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, phone, age, gender } = req.body;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "profile_pics" }
      );

      user.avatar = uploadResult.secure_url;
    }

    user.name = name;
    user.phone = phone;
    user.age = age;
    user.gender = gender;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
