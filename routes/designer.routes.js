const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");
const Designer = require("../models/Designer.model");
const uploader = require("../middlewares/cloudinary.config");
// All routes start with /api/designers

// Need the middleware cloudinary
router.post(
  "/",
  isAuthenticated,
  uploader.single("image"),
  async (req, res) => {
    try {
      console.log(req.file);
      const newDesigner = await Designer.create({
        ...req.body,
        vendor: req.tokenPayload.userId,
        image: req.file.path,
      });
      res.status(201).json(newDesigner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const designers = await Designer.find().populate({
      path: "vendor",
      select: "-hashedPassword",
    }); // Make sure to strip away the password
    res.json(designers);
  } catch (error) {
    console.log(error);
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
    const updateDesigner = await Designer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (updatedDesigner) {
      res.json(updatedDesigner);
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


