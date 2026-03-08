const Log = require('../models/logModel');

const logActivity = async (req, action, details = '') => {
    try {
        await Log.create({
            user: req.user ? req.user._id : null,
            action,
            details,
            ip: req.ip,
        });
    } catch (error) {
        console.error('Logging failed:', error);
    }
};

module.exports = logActivity;
