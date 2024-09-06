const express = require("express");
const Product = require("../models/models/Product.model");
const {
  isAuthenticated,
  isAdmin,
} = require("../middlewares/route-gaurd.middleware"); // Middleware to check admin role
const router = express.Router();

const isOwner = (req, res, next) => {
  if (req.tokenPayload.role !== "owner") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  next();
};
// CREATE a new product
router.post("/", isAuthenticated, isOwner, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// READ all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "username"); // Populate the creator's username if needed
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a product by ID
router.put("/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product by ID
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if current user is the owner or has an admin role
    if (req.user.role !== "owner" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
