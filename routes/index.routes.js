const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const productRoutes = require("./product.routes");
router.use("/products", productRoutes);

const userRoutes = require("./user.routes");
router.use("/users", userRoutes);

const profileRoutes = require("./profile.routes");
router.use("/profile", profileRoutes);

// const postsRoutes = require("./post.routes");
// router.use("/post", postsRoutes);

module.exports = router;
