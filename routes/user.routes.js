const express = require("express");
const router = express.Router();
const uploader = require("../middlewares/cloudinary.config");
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user details (authenticated user)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.tokenPayload.userId)
      .populate("posts")
      .populate("friends", "username profilePicture");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user details (authenticated user)
router.put("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.tokenPayload.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
