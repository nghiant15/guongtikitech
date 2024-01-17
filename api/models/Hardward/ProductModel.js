const { Decimal128 } = require('bson');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    shop_id: {
        type: String,
        ref: "User"
    },
    image: {
        type: String
    },
    link: {
        type: String
    },
    weight: {
        type: Number,
        default: 0
    },
    info_product: {
        type: String
    },
    how_to_use: {
        type: String
    },
    description: {
        type: String
    },
    description_brand: {
        type: String
    },
    total_deal: {
        type: Number
    },
    price: {
        type: Number,
        default: 0
    },
    code: {
        type: String
    },
    sku_code: { /* Đây là mã scan code */
        type: String
    },
    brand_id: {
        type: String,
        ref: "BrandHardware"
    },
    category_id: {
        type: String,
        ref: "Category"
    },
    company_id: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ProductHardware', ProductSchema, "ProductHardware");