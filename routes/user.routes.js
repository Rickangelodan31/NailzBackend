const express = require("express");
const router = express.Router();
const uploader = require("../middlewares/cloudinary.config");
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");

// Create a new user
router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, dateOfBirth, email, password, signupKey } = req.body;
  const saltRounds = 13;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const foundUser = await User.findOne({ username: username });
    if (foundUser) {
      return res.status(401).json("Username already exists");
    }

    const role = signupKey === process.env.SIGNUP_KEY ? "owner" : "user"; // Assign role based on the signup key

    const newUser = await User.create({
      firstName,
      lastName,
      dateOfBirth,
      username,
      email,
      hashedPassword,
      role: role || 'user',
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user details (authenticated user)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.tokenPayload.userId)
      .populate("posts")
      .populate("username profilePicture");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.tokenPayload.userId)
      .populate("posts")
      .populate("username profilePicture");
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
router.delete("/user/:id", isAuthenticated, async (req, res) => {
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
