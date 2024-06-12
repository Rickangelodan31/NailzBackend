// Import necessary modules
const mongoose = require("mongoose");

// Define the profile schema
const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  profilePicture: {
    type: String, // Assuming the profile picture is stored as a URL
  },
  // Other fields as needed
});

// Create the profile model
const Profile = mongoose.model("profiles", profileSchema);

// Export the profile model
module.exports = Profile;
