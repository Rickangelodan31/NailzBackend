// const Post = require('../Controllers/');

// exports.createPost = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const newPost = new Post({ title, content, author: req.tokenPayload.userId });
//         await newPost.save();
//         res.status(201).json(newPost);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.getAllPosts = async (req, res) => {
//     try {
//         const posts = await Post.find().populate('author', '-password').sort({ createdAt: -1 });
//         res.json(posts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.getPostById = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id).populate('author', '-password');
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         res.json(post);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// exports.updatePost = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content, updatedAt: Date.now() }, { new: true, runValidators: true }).populate('author', '-password');
//         if (!updatedPost) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         res.json(updatedPost);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.deletePost = async (req, res) => {
//     try {
//         const deletedPost = await Post.findByIdAndDelete(req.params.id);
//         if (!deletedPost) {
//             return res.status(404).json({ message: 'Post not found' });
//         }
//         res.json({ message: 'Post deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
