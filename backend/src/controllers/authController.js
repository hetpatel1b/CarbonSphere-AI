const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields: name, email, and password"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save to MongoDB
    await newUser.save();

    // Return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(`Error in loginUser: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const logoutUser = async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(`Error in getCurrentUser: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
