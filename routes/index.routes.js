const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const designerRoutes = require("./designer.routes");
router.use("/designers", designerRoutes);

const userRoutes = require("./user.routes");
router.use("/users", userRoutes);

// const friendsRoutes = require("./profile.routes");
// router.use("/friendslist", friendsRoutes);

// const profileRoutes = require("./profile.routes");
// router.use("/profile", profileRoutes);

const friendsRoutes = require("./friends.routes");
router.use("/friends", friendsRoutes);

const postsRoutes = require("./post.routes");
router.use("/post", postsRoutes);

module.exports = router;
