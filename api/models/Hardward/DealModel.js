const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    category: [{
        category_id: {
            type: String,
            ref: "Category"
        },
        product: [{
            product_id: {
                type: String,
                ref: "Product"
            },
            total_deal: {
                type: Number,
                default: 0
            }
        }]
    }],
    image: {
        type: String
    },
    time_start: {
        type: Date,
        default: Date.now()
    },
    time_finish: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        default: "0"
    },
    slug: {
        type: String
    },
    status: {
        type: String,
        default: "0"
    },
    voucher: {
        type: Number,
        default: 0
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Deal', DealSchema, 'Deal');