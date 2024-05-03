const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const designerRoutes = require("./designer.routes");
router.use("/designers", designerRoutes);

module.exports = router;
