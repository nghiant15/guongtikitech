const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    content: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', NotificationSchema, "Notification");