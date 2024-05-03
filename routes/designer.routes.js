const express = require("express");
const router = express.Router();
const Designer = require('../models/Designer.model')

// All routes start with /api/designers

router.post("/", async (req, res) => {
  try {
    const designer = await Designer.create(req.body);
    res.status(201).json(designer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const designers = await Designer.find();
    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    if (designer) {
      res.json(designer);
    } else {
      res.status(404).json({ message: "Designer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await Designer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (designer) {
      res.json(designer);
    } else {
      res.status(404).json({ message: "Designer not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await Designer.findByIdAndDelete(id);
    if (designer) {
      res.json({ message: "Designer deleted successfully" });
    } else {
      res.status(404).json({ message: "Designer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;