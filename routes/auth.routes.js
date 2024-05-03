const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");

router.get("/", (req, res) => {
  res.json("All good in auth");
});
router.post("/signup", async (req, res) => {
  const { firstName, lastName, dateOfBirth, password } = req.body;
  const saltRounds = 13;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      dateOfBirth,
      hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const potentialUser = await User.findOne({ username: req.body.username });
    if (potentialUser) {
      if (bcrypt.compareSync(req.body.password, potentialUser.hashedPassword)) {
        const authToken = jwt.sign(
          {
            userId: potentialUser._id,
          },
          process.env.TOKEN_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "6h",
          }
        );

        res
          .status(200)
          .json({ message: "Password Accepted", token: authToken });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There is a problem" });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.json({ message: "Hello", data: req.tokenPayload });
});


// Example to get back current user
router.get("/user", isAuthenticated, async(req, res) => {
  const userId = req.tokenPayload.userId

  const currentUser = await User.findById(userId, { hashedPassword: 0 })
});


module.exports = router;
