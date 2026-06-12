const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Verify user exists and is active in database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account no longer exists"
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: `Your account is currently ${user.status}`
        });
      }

      // Store decoded user info in req.user
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }
};

module.exports = { protect };
