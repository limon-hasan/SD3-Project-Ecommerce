const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Can be anonymous
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: false,
    },
    ip: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Log', logSchema);
