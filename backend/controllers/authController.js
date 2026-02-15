const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } = require('../utils/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate 6 digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            verificationCode,
            verificationCodeExpire,
            isVerified: false
        });

        if (user) {
            // Send verification email
            try {
                await sendVerificationEmail(user, verificationCode);
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
            }
            
            res.status(201).json({
                success: true,
                message: 'User registered. Please check your email for verification code.',
                requiresVerification: true,
                email: user.email
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save();

        // Send welcome email now that they are verified
        sendWelcomeEmail(user).catch(err => 
            console.error('Welcome email failed:', err)
        );

        // Auto login after verification
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerifiedCreator: user.isVerifiedCreator
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Resend Verification Code
// @route   POST /api/auth/resend-code
// @access  Public
exports.resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new 6 digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        user.verificationCode = verificationCode;
        user.verificationCodeExpire = verificationCodeExpire;
        await user.save();

        try {
            await sendVerificationEmail(user, verificationCode);
            res.status(200).json({ success: true, message: 'Verification code sent' });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Check if verified
            if (!user.isVerified) {
                return res.status(401).json({ 
                    error: 'Please verify your email address before logging in.', 
                    requiresVerification: true 
                });
            }

            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerifiedCreator: user.isVerifiedCreator
                },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                },
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Verify user password
// @route   POST /api/auth/verify-password
// @access  Private
exports.verifyPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid password' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        // Save (validateBeforeSave: false to ignore password requirement if any)
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        // Should point to frontend page: /reset-password/:token
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        try {
            await sendPasswordResetEmail(user, resetUrl);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ error: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = require('crypto')
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            data: 'Password updated success',
            token: generateToken(user._id) // Optional: auto login
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
