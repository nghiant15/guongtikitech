const mongoose = require('mongoose');

const CountOrderSchema = new mongoose.Schema({
    product_id: {
        type: String
    },
    order_id: {
        type: String
    },
    slug: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('CountOrder', CountOrderSchema, "CountOrder");