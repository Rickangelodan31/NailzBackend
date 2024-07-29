const express = require('express');
const router = express.Router();
const uploader = require('../middlewares/cloudinary.config');
const { isAuthenticated } = require('../middlewares/route-gaurd.middleware');

const { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser, 
    searchUsers, 
    getActiveUsers, 
    getInactiveUsers, 
    getProfile, 
    updateProfile, 
    getUserSettings, 
    updateUserSettings 
} = require('../controllers/UserController');

// Basic CRUD operations
router.post('/users', isAuthenticated, createUser);
router.get('/users', isAuthenticated, getAllUsers);
router.get('/users/:id', isAuthenticated, getUserById);
router.put('/users/:id', isAuthenticated, updateUser);
router.delete('/users/:id', isAuthenticated, deleteUser);

// Additional operations
router.get('/users/search', isAuthenticated, searchUsers);
router.get('/users/active', isAuthenticated, getActiveUsers);
router.get('/users/inactive', isAuthenticated, getInactiveUsers);

// Profile and settings
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);
router.get('/settings', isAuthenticated, getUserSettings);
router.put('/settings', isAuthenticated, updateUserSettings);

// Route to handle profile picture uploads
router.post('/profilePicture', isAuthenticated, uploader.single('profilePicture'), async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.tokenPayload.userId, {
            image: req.file.path,
        });
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Additional routes (from original example)
router.get('/:userId/posts', isAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ ownerId: userId });
        if (posts) {
            res.json(posts);
        } else {
            res.status(404).json({ message: 'No posts found for this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
