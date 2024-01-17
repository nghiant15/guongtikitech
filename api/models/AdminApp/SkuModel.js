const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    type_id: {
        type: mongoose.Types.ObjectId,
        trim: true
    },
    brand_id: {
        type: mongoose.Types.ObjectId,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    href: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    company_id: {
        type: String,
    },
    color_id:{
        type: mongoose.Types.ObjectId,
        trim: true
    },
    create_date:{
        type: Number
    },
    update_date:{
        type: Number
    }
});

module.exports = mongoose.model('tb_product_makeup', ProductSchema);