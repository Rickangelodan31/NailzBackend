// routes/friends.routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");

// Search for users
router.get("/search", isAuthenticated, async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Send a friend request
router.post("/request", isAuthenticated, async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.tokenPayload.userId;

  try {
    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friendRequests.includes(currentUserId)) {
      user.friendRequests.push(currentUserId);
      await user.save();
    } else {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Accept a friend request
router.post("/accept", isAuthenticated, async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.tokenPayload.userId;

  try {
    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.friendRequests.includes(userId)) {
      currentUser.friends.push(userId);
      currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== userId
      );
      await currentUser.save();

      user.friends.push(currentUserId);
      await user.save();

      res.status(200).json({ message: "Friend request accepted" });
    } else {
      res.status(400).json({ message: "No friend request from this user" });
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch friend requests
router.get("/requests", isAuthenticated, async (req, res) => {
  try {
    const currentUserId = req.tokenPayload.userId;
    const user = await User.findById(currentUserId).populate(
      "friendRequests",
      "username email profilePicture"
    );
    res.json(user.friendRequests);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch friends with profile pictures and posts
router.get("/friends", isAuthenticated, async (req, res) => {
  try {
    const currentUserId = req.tokenPayload.userId;
    const user = await User.findById(currentUserId).populate({
      path: "friends",
      select: "username email profilePicture",
      populate: {
        path: "posts",
        select: "content createdAt",
      },
    });
    res.json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
