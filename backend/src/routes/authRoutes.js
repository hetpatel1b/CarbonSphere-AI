const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const authSchemas = require('../validations/auth.schema');

console.log("Auth routes loading...");

router.post('/register', validate(authSchemas.register), registerUser);
router.post('/login', validate(authSchemas.login), loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

module.exports = router;
