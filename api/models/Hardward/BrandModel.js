const mongoose = require('mongoose');

const BrandHardwareSchema = new mongoose.Schema({
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
    company_id: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('BrandHardware', BrandHardwareSchema, "BrandHardware");