const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
    code_transport: {
        type: String
    },
    code_payment: {
        type: String
    },
    order_id: {
        type: String,
        ref: "Order"
    },
    res_order: {
        type: Object
    },
    status: {
        type: String
    },
    status_tkn: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Transport', TransportSchema, "Transport");