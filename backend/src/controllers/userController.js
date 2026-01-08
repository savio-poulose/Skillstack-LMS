const User = require("../models/user.model");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, phone, age, gender } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (age) updateData.age = age;
    if (gender) updateData.gender = gender;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

