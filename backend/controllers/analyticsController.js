const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalyticsData = asyncHandler(async (req, res) => {
    // 1. Daily Revenue (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRevenue = await Order.aggregate([
        {
            $match: {
                isPaid: true,
                paidAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                revenue: { $sum: "$totalPrice" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 2. Top Selling Products
    const topProducts = await Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: "$orderItems" },
        {
            $group: {
                _id: "$orderItems.product",
                name: { $first: "$orderItems.name" },
                sales: { $sum: "$orderItems.qty" },
                revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } }
            }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 }
    ]);

    // 3. Order Status Distribution
    const orderStatus = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Format dates for daily revenue (fill missing days with 0)
    const formattedDailyRevenue = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const found = dailyRevenue.find(item => item._id === dateStr);
        formattedDailyRevenue.push({
            date: dateStr,
            revenue: found ? found.revenue : 0
        });
    }
    formattedDailyRevenue.reverse();

    res.json({
        dailyRevenue: formattedDailyRevenue,
        topProducts,
        orderStatus: orderStatus.map(item => ({ name: item._id, value: item.count }))
    });
});

module.exports = {
    getAnalyticsData
};
