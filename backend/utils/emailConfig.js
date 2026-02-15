const nodemailer = require('nodemailer');

/**
 * Email configuration using Gmail SMTP
 * Requires Gmail App Password (not regular password)
 * To create App Password:
 * 1. Enable 2FA on your Gmail account
 * 2. Go to Google Account > Security > 2-Step Verification > App passwords
 * 3. Generate a new app password for "Mail"
 */

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        return false;
    }
};

module.exports = {
    createTransporter,
    testEmailConfig
};
