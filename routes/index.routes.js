const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const designerRoutes = require("./Designer.routes");
router.use("/Designer", designerRoutes);


const userRoutes = require("./user.routes");
router.use("/users", userRoutes);

module.exports = router;
