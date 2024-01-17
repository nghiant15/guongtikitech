const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
    hex: {
        type: String,
        trim: true
    },
    makeup_id: {
        type: String,
        trim: true
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        trim: true
    },
    alpha: {
        type: Number,
        trim: true
    },
    ver:{
        type: String,
        trim: true
    },
    create_date:{
        type: Number
    },
    update_date:{
        type: Number
    },
    company_id: {
        type: String,
    }
});

module.exports = mongoose.model('tb_color', ColorSchema);