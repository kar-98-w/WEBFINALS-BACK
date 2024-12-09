const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Login - Generates token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get user profile
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// Edit user profile
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update password
router.put("/update-password", protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    console.log("Request Body: ", req.body);
    console.log("User ID from JWT middleware: ", req.user._id);
  
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        console.error("User not found in DB.");
        return res.status(404).json({ message: "User not found" });
      }
  
      // Log the user's hashed password from the database
      console.log("User's hashed password: ", user.password);
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      console.log("Password comparison result: ", isMatch);
  
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
  
        await user.save();
        console.log("New password saved: ", user.password);
  
        return res.status(200).json({ message: "Password updated successfully" });
      }
  
      return res.status(401).json({ message: "Old password is incorrect" });
    } catch (error) {
      console.error("Server error: ", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  });

module.exports = router;
