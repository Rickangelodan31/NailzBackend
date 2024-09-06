const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "user", "Ricky"], // Define possible roles
      default: "user", // Default role is 'user'
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
