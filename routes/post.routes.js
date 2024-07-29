const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { isAuthenticated } = require('../middlewares/route-guard.middleware');

// Post Routes
router.post('/posts', isAuthenticated, PostController.createPost);
router.get('/posts', isAuthenticated, PostController.getAllPosts);
router.get('/posts/:id', isAuthenticated, PostController.getPostById);
router.put('/posts/:id', isAuthenticated, PostController.updatePost);
router.delete('/posts/:id', isAuthenticated, PostController.deletePost);

module.exports = router;
