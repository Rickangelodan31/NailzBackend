const router = require("express").Router();
const Profile = require("../models/profile.model");
const isAuthenticated = require("../middlewares/route-gaurd.middleware");

// Route to create a new profile
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { username, bio, age, profilePicture } = req.body;
    const newProfile = new Profile({ username, bio, age, profilePicture });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all profiles
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific profile by ID
router.get("/:id", isAuthenticated, getProfile, (req, res) => {
  res.json(res.profile);
});

// Route to update a profile by ID
router.put("/:id", isAuthenticated, getProfile, async (req, res) => {
  try {
    if (req.body.username != null) {
      res.profile.username = req.body.username;
    }
    if (req.body.bio != null) {
      res.profile.bio = req.body.bio;
    }
    if (req.body.age != null) {
      res.profile.age = req.body.age;
    }
    if (req.body.profilePicture != null) {
      res.profile.profilePicture = req.body.profilePicture;
    }
    await res.profile.save();
    res.json(res.profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a profile by ID
router.delete("/:id", isAuthenticated, getProfile, async (req, res) => {
  try {
    await res.profile.remove();
    res.json({ message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to retrieve a specific profile by ID
async function getProfile(req, res, next) {
  let profile;
  try {
    profile = await Profile.findById(req.params.id);
    if (profile == null) {
      return res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.profile = profile;
  next();
}

module.exports = router;
