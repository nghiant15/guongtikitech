const mongoose = require('mongoose');

const CapacitySchema = new mongoose.Schema({
    product_id: {
        type: String
    },
    slug: {
        type: String
    },
    capacity: {
        type: Number
    },
    price: {
        type: Number
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Capacity', CapacitySchema, "Capacity");