const mongoose = require('mongoose');

const OrderAddressSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: "User"
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    distrist: {
        type: String
    },
    ward: {
        type: String
    },
    phone: {
        type: Number
    },
    isSelect: {
        type: String,
        default: 0
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('OrderAddress', OrderAddressSchema, 'OrderAddress');