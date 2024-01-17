const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: "User"
    },
    detail_id: {
        type: String,
        ref: "OrderDetail"
    },
    create_at: {
        type: Date,
        default: Date.now()
    },
    payment_method: {
        type: String
    },
    transport_method: {
        type: String
    },
    transport_id: {
        type: String,
        ref: "Transport"
    },
    total: {
        type: Number,
        default: 0
    },
    order_address_id: {
        type: String,
        ref: "OrderAddress"
    },
    transport_cost: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    delivery: {
        type: String
    },
    status: {
        type: String,
        default: "0"
    },
    status_tkn: {
        type: String
    },
    vnpaystatus: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('OrderStore', OrderSchema, 'OrderStore');