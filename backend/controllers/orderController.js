const Order = require('../models/Order');
const { sendOrderConfirmation, sendOrderStatusUpdate, sendAdminOrderNotification } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ error: 'No order items' });
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            const createdOrder = await order.save();
            
            // Send order confirmation email to customer
            sendOrderConfirmation(createdOrder, req.user).catch(err => 
                console.error('Email sending failed:', err)
            );
            
            // Send notification to admin
            sendAdminOrderNotification(createdOrder, req.user).catch(err => 
                console.error('Admin notification failed:', err)
            );
            
            res.status(201).json({
                success: true,
                data: createdOrder
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if user is owner or admin
            // If order.user is null (deleted user), only admin can view
            if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Not authorized to view this order' });
            }
            
            // If order.user is null and requester is not admin, deny access
            if (!order.user && req.user.role !== 'admin') {
                 return res.status(403).json({ error: 'Not authorized to view this order' });
            }
            res.json({
                success: true,
                data: order
            });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'Delivered';

            const updatedOrder = await order.save();
            
            // Populate user data for email
            await updatedOrder.populate('user', 'name email');
            
            // Send status update email
            sendOrderStatusUpdate(updatedOrder, updatedOrder.user, 'Delivered').catch(err => 
                console.error('Email sending failed:', err)
            );
            
            res.json({
                success: true,
                data: updatedOrder
            });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
