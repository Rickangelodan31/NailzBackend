const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");
const User = require("../models/User.model");
const Designer = require("../models/Designer.model");

// CREATE a new post
router.post("/user", isAuthenticated, async (req, res) => {
  try {
    const newUserPost = await User.create({
      ...req.body,
      vendor: req.tokenPayload.userId,
    });
    res.status(201).json(newUserPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/designer", isAuthenticated, async (req, res) => {
  try {
    const newDesignerPost = await Designer.create({
      ...req.body,
      vendor: req.tokenPayload.userId,
    });
    res.status(201).json(newDesignerPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ all posts
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const userPosts = await User.find({ vendor: req.tokenPayload.userId });
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/designer", isAuthenticated, async (req, res) => {
  try {
    const designerPosts = await Designer.find({ vendor: req.tokenPayload.userId });
    res.json(designerPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a post
router.put("/user/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userPost = await User.findById(postId);
    if (!userPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (userPost.vendor.toString() !== req.tokenPayload.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedUserPost = await User.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedUserPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/designer/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const designerPost = await Designer.findById(postId);
    if (!designerPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (designerPost.vendor.toString() !== req.tokenPayload.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedDesignerPost = await Designer.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedDesignerPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a post
router.delete("/user/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userPost = await User.findById(postId);
    if (!userPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (userPost.vendor.toString() !== req.tokenPayload.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await User.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/designer/:postId", isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const designerPost = await Designer.findById(postId);
    if (!designerPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (designerPost.vendor.toString() !== req.tokenPayload.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Designer.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
