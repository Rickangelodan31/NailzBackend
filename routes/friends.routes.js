// routes/friends.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/route-gaurd.middleware');
const User = require('../models/User.model');
const Friend = require('../models/Friend.model');


router.use(isAuthenticated);
// Send friend request
router.post('/request', async (req, res) => {
  const { userA, userB } = req.body;
  const docA = await Friend.findOneAndUpdate(
    { requester: userA, recipient: userB },
    { $set: { status: 1 } },
    { upsert: true, new: true }
  );
  const docB = await Friend.findOneAndUpdate(
    { recipient: userA, requester: userB },
    { $set: { status: 2 } },
    { upsert: true, new: true }
  );
  await User.findByIdAndUpdate(userA, { $push: { friends: docA._id } });
  await User.findByIdAndUpdate(userB, { $push: { friends: docB._id } });
  res.status(200).send('Friend request sent');
});

// Accept friend request
router.post('/accept', async (req, res) => {
  const { userA, userB } = req.body;
  await Friend.findOneAndUpdate(
    { requester: userA, recipient: userB },
    { $set: { status: 3 } }
  );
  await Friend.findOneAndUpdate(
    { recipient: userA, requester: userB },
    { $set: { status: 3 } }
  );
  res.status(200).send('Friend request accepted');
});

// Reject friend request
router.post('/reject', async (req, res) => {
  const { userA, userB } = req.body;
  const docA = await Friend.findOneAndRemove({ requester: userA, recipient: userB });
  const docB = await Friend.findOneAndRemove({ recipient: userA, requester: userB });
  await User.findByIdAndUpdate(userA, { $pull: { friends: docA._id } });
  await User.findByIdAndUpdate(userB, { $pull: { friends: docB._id } });
  res.status(200).send('Friend request rejected');
});

// Get all friends of a user
router.get('/:userId/friends', async (req, res) => {
  const userId = req.params.userId;
  const friends = await User.aggregate([
    {
      "$lookup": {
        "from": "friends",
        "let": { "friends": "$friends" },
        "pipeline": [
          {
            "$match": {
              "recipient": mongoose.Types.ObjectId(userId),
              "$expr": { "$in": ["$_id", "$$friends"] }
            }
          },
          { "$project": { "status": 1 } }
        ],
        "as": "friends"
      }
    },
    {
      "$addFields": {
        "friendsStatus": { "$ifNull": [{ "$min": "$friends.status" }, 0] }
      }
    }
  ]);
  res.status(200).json(friends);
});

router.get('/requests', async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user ID is available in req.user after authentication
      const pendingRequests = await Friend.find({ recipient: userId, status: 1 })
        .populate('requester', 'username profilePicture') // Adjust fields to populate as needed
        .exec();
      res.status(200).json(pendingRequests);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
});

module.exports = router;
