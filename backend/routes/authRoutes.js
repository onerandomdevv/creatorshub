const express = require('express');
const router = express.Router();
const { register, login, getMe, updateUserProfile, verifyPassword, forgotPassword, resetPassword, verifyEmail, resendVerificationCode } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-code', resendVerificationCode);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.post('/verify-password', protect, verifyPassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
