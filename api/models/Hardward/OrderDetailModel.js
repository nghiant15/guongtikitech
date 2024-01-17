const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
    order_id: {
        type: String
    },
    list_product: [{
        product_id: {
            type: String,
            ref: "ProductHardware"
        },
        price: {
            type: Number
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('OrderDetailStore', OrderDetailSchema, 'OrderDetailStore');