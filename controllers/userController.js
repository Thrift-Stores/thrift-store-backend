const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
