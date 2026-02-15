const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Admin password is required' });
        }

        // Verify Admin Password
        const admin = await User.findById(req.user.id).select('+password');
        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid admin password' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.role = role || user.role;
        const updatedUser = await user.save();

        res.json({
            success: true,
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Admin password is required to delete a user' });
        }

        // Verify Admin Password
        const admin = await User.findById(req.user.id).select('+password');
        if (!admin || !(await admin.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid admin password' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.deleteOne();

        res.json({ success: true, message: 'User removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
