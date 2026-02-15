const { createTransporter } = require('./emailConfig');
const {
    orderConfirmationTemplate,
    orderStatusUpdateTemplate,
    welcomeEmailTemplate,
    passwordResetTemplate,
    verificationEmailTemplate
} = require('./emailTemplates');

/**
 * Email service for sending transactional emails
 * Handles order confirmations, status updates, and welcome emails
 */

// Send order confirmation email
const sendOrderConfirmation = async (order, user) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmation - #${order._id.slice(-8).toUpperCase()}`,
            html: orderConfirmationTemplate(order, user)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${user.email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error.message);
        // Don't throw error - email failure shouldn't break order creation
        return { success: false, error: error.message };
    }
};

// Send order status update email
const sendOrderStatusUpdate = async (order, user, newStatus) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Order ${newStatus} - #${order._id.slice(-8).toUpperCase()}`,
            html: orderStatusUpdateTemplate(order, user, newStatus)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order status update email sent to ${user.email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending order status email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send welcome email to new users
const sendWelcomeEmail = async (user) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to Creators Hub! 🎉',
            html: welcomeEmailTemplate(user)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send email to admin for new orders
const sendAdminOrderNotification = async (order, user) => {
    try {
        // Only send if admin email is configured
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            console.log('⚠️ Admin email not configured, skipping admin notification');
            return { success: false, error: 'Admin email not configured' };
        }

        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `New Order Received - #${order._id.slice(-8).toUpperCase()}`,
            html: `
                <h2>New Order Received</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
                <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.orderItems.length}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <br>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders">View in Admin Dashboard</a>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Admin notification email sent`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending admin notification:', error.message);
        return { success: false, error: error.message };
    }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetUrl) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: passwordResetTemplate(resetUrl)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${user.email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send verification email
const sendVerificationEmail = async (user, code) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Creators Hub" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Verify Your Email Address',
            html: verificationEmailTemplate(code)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${user.email}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending verification email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendWelcomeEmail,
    sendAdminOrderNotification,
    sendPasswordResetEmail,
    sendVerificationEmail
};
