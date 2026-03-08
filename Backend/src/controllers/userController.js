const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Send Welcome Email
    const verifyUrl = `http://localhost:5173/verify-email?email=${user.email}`;

    await sendEmail({
      email: user.email,
      subject: 'Welcome to ShopSphere - Verify Your Email',
      message: `Hi ${user.name},\n\nWelcome to ShopSphere! Please verify your email here: ${verifyUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="color: #333; margin-bottom: 20px;">Welcome to ShopSphere! 🛍️</h1>
                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    Hi <strong>${user.name}</strong>,<br>
                    We're thrilled to have you join our exclusive community. To get started and unlock all features, please verify your email address.
                </p>
                <a href="${verifyUrl}" style="background-color: #6c5ce7; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Verify My Account
                </a>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    If you didn't create this account, you can safely ignore this email.<br>
                    Run locally: <a href="${verifyUrl}">${verifyUrl}</a>
                </p>
            </div>
        </div>
      `
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:id
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.id;

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  toggleWishlist,
  getWishlist,
};