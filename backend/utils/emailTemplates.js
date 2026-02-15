/**
 * Professional HTML email templates for Creators Hub
 * All templates use inline CSS for maximum email client compatibility
 */

// Base email wrapper with consistent styling
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creators Hub</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">
                                CREATORS HUB
                            </h1>
                            <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                Professional Gear for Every Creator
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px;">
                                Thank you for shopping with Creators Hub!
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © ${new Date().getFullYear()} Creators Hub. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Order confirmation email template
const orderConfirmationTemplate = (order, user) => {
    const itemsHtml = order.orderItems.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.name}</div>
                <div style="color: #6b7280; font-size: 14px;">Qty: ${item.qty}</div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #111827;">
                $${(item.price * item.qty).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">✓</span>
            </div>
            <h2 style="margin: 0 0 8px; color: #111827; font-size: 24px; font-weight: 700;">
                Order Confirmed!
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
                Hi ${user.name}, your order has been received.
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                <span style="color: #111827; font-weight: 600; font-family: monospace;">#${order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">Order Date:</span>
                <span style="color: #111827; font-weight: 600;">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
        </div>

        <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px; font-weight: 700;">
            Order Summary
        </h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            ${itemsHtml}
            <tr>
                <td style="padding: 12px 0; color: #6b7280;">Subtotal</td>
                <td style="padding: 12px 0; text-align: right; color: #111827;">$${(order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</td>
            </tr>
            ${order.taxPrice > 0 ? `
            <tr>
                <td style="padding: 12px 0; color: #6b7280;">Tax</td>
                <td style="padding: 12px 0; text-align: right; color: #111827;">$${order.taxPrice.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="padding: 12px 0; color: #6b7280;">Shipping</td>
                <td style="padding: 12px 0; text-align: right; color: #111827;">$${order.shippingPrice.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 16px 0 0; font-size: 18px; font-weight: 700; color: #111827;">Total</td>
                <td style="padding: 16px 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #14b8a6;">$${order.totalPrice.toFixed(2)}</td>
            </tr>
        </table>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <strong>What's next?</strong><br>
                We're preparing your order for shipment. You'll receive another email with tracking information once your order ships.
            </p>
        </div>

        <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/orders" 
               style="display: inline-block; background-color: #14b8a6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Order Details
            </a>
        </div>
    `;

    return emailWrapper(content);
};

// Order status update email template
const orderStatusUpdateTemplate = (order, user, newStatus) => {
    const statusConfig = {
        'Pending': { icon: '⏳', color: '#f59e0b', message: 'Your order is pending confirmation.' },
        'Processing': { icon: '📦', color: '#3b82f6', message: 'We\'re preparing your order for shipment.' },
        'Shipped': { icon: '🚚', color: '#8b5cf6', message: 'Your order is on its way!' },
        'Delivered': { icon: '✅', color: '#10b981', message: 'Your order has been delivered.' },
        'Cancelled': { icon: '❌', color: '#ef4444', message: 'Your order has been cancelled.' }
    };

    const status = statusConfig[newStatus] || statusConfig['Processing'];

    const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 16px;">${status.icon}</div>
            <h2 style="margin: 0 0 8px; color: #111827; font-size: 24px; font-weight: 700;">
                Order ${newStatus}
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
                Hi ${user.name}, ${status.message}
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                <span style="color: #111827; font-weight: 600; font-family: monospace;">#${order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">Status:</span>
                <span style="color: ${status.color}; font-weight: 700;">${newStatus}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">Total:</span>
                <span style="color: #111827; font-weight: 600;">$${order.totalPrice.toFixed(2)}</span>
            </div>
        </div>

        <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/orders" 
               style="display: inline-block; background-color: #14b8a6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Order
            </a>
        </div>
    `;

    return emailWrapper(content);
};

// Welcome email template
const welcomeEmailTemplate = (user) => {
    const content = `
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 16px;">👋</div>
            <h2 style="margin: 0 0 8px; color: #111827; font-size: 24px; font-weight: 700;">
                Welcome to Creators Hub!
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
                Hi ${user.name}, we're excited to have you join our community.
            </p>
        </div>

        <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0 0 16px; color: #111827; font-size: 16px; line-height: 1.6;">
                At Creators Hub, we provide professional-grade equipment and tools to help creators like you bring your vision to life.
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Browse our catalog of cameras, audio equipment, lighting, and more to find the perfect gear for your next project.
            </p>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
               style="display: inline-block; background-color: #14b8a6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-bottom: 12px;">
                Start Shopping
            </a>
        </div>

        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                <strong>Need help?</strong><br>
                Our support team is here to assist you. Visit our Help Center or contact us anytime.
            </p>
        </div>
    `;

    return emailWrapper(content);
};

// Password reset email template
const passwordResetTemplate = (resetUrl) => {
    const content = `
        <h2>Password Reset Request</h2>
        <p>You receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click on the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;
    return emailWrapper(content);
};

// Verification email template
const verificationEmailTemplate = (code) => {
    const content = `
        <h2>Verify Your Email</h2>
        <p>Thank you for registering with Creators Hub. Please use the verification code below to complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background: #EEF2FF; padding: 10px 20px; border-radius: 10px;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not create an account, please ignore this email.</p>
    `;
    return emailWrapper(content);
};

module.exports = {
    orderConfirmationTemplate,
    orderStatusUpdateTemplate,
    welcomeEmailTemplate,
    passwordResetTemplate,
    verificationEmailTemplate
};
