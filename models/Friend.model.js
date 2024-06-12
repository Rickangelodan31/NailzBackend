const { Schema, model, Types } = require("mongoose");

// models/Friend.js
const friendsSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User" },
    recipient: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, enum: [0, 1, 2, 3] }, // 0: 'add friend', 1: 'requested', 2: 'pending', 3: 'friends'
  },
  { timestamps: true }
);
const Friend = model("Friend", friendsSchema);

module.exports = Friend;
