const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Log = require('../models/logModel');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const orders = await Order.find({ isPaid: true });
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // Get recent logs
        const recentLogs = await Log.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('user', 'name email');

        res.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalSales,
            recentLogs,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
