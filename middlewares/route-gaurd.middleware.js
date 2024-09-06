const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); // Adjust path as necessary

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    // Fetch user from the database to check the isAdmin status
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json("User not found");
    }

    req.tokenPayload = payload;
    req.user = user; // Attach the user object to req for access in the next route
    next();
  } catch (error) {
    res.status(401).json("Token not provided or not valid");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json("Access denied. Admins only.");
  }
};

module.exports = { isAuthenticated, isAdmin };
