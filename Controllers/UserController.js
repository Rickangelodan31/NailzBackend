const User = require('../models/User.model');

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, email, username, password } = req.body;
        if (!firstName || !lastName || !dateOfBirth || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = new User({ firstName, lastName, dateOfBirth, email, username, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Additional functionalities
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({ $text: { $search: query } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getActiveUsers = async (req, res) => {
    try {
        const users = await User.find({ active: true }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInactiveUsers = async (req, res) => {
    try {
        const users = await User.find({ active: false }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.tokenPayload.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.tokenPayload.userId, req.body, {
            new: true,
            runValidators: true
        }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.tokenPayload.userId).select('settings');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserSettings = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.tokenPayload.userId, { settings: req.body }, {
            new: true,
            runValidators: true
        }).select('settings');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
