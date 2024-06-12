const { Schema, model } = require("mongoose");

// Define the User schema
const userSchema = new Schema(
  {
    profilePicture: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bio: {
      type: String,
    },
    age: {
      type: Number,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friends' }]
  },
  {
    timestamps: true, // This correctly enables timestamps
  }
);

// Create the User model
const User = model("User", userSchema);

module.exports = User;
