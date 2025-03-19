const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate Access and Refresh Tokens
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' }); // Shorter expiration
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' }); // Longer expiration
};

// Register User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    if (!email.endsWith('@cuchd.in')) {
      return res.status(400).json({ message: 'Only CUCHD domain emails are allowed' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before saving
    const user = await User.create({ username, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send refresh token as an httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false in dev mode
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set the refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false in dev mode
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Access Token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

  if (!refreshToken) {
    return res.status(403).json({ message: 'No refresh token, access denied' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Find the user associated with the refresh token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new access token
    const accessToken = generateAccessToken(user._id);

    // Send the new access token
    return res.json({ accessToken });
  });
};
