const { Decimal128 } = require('bson');
const mongoose = require('mongoose');

const CheckOrderSchema = new mongoose.Schema({
    sale_id: {
        type: String,
        trim: true,
        ref: "User"
    },
    shop_id: {
        type: String,
        trim: true,
        ref: "User"
    },
    weight: {
        type: Number,
        default: 1
    },
    quantity: {
        type: Number,
        default: 1
    },
    scan_code: { /*Mã barcode*/ 
        type: String 
    },
    customer_phone: {
        type: String,
        default: 0
    },
    code_order: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    },
    total: {
        type: Number,
        default: 0
    },
    type: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('CheckOrder', CheckOrderSchema, "CheckOrder");