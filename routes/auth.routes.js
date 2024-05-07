const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/route-gaurd.middleware");


router.get("/", (req, res) => {
  res.json("All good in auth");
});
router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, dateOfBirth, password } = req.body;
  const saltRounds = 13;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // const username = generateUsername(firstName, lastName);

  try {
    const foundUser = await User.findOne({
      username: username,
    });
    if (foundUser) {
      res.status(401).json(" Username already exist");
      return;
    }
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      username: username,
      hashedPassword: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
function generateUsername(firstName, lastName) {
  if (!firstName || !lastName) {
    return new Error(
      "Both first name and last name are required to generate a username"
    );
  }

  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
}

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
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const userId = req.tokenPayload.userId;

    const currentUser = await User.findById(userId, { hashedPassword: 0 });
    res.status(200).json(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching current user" });
  }
});

module.exports = router;
