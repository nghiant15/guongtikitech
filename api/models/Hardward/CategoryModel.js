const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    product_id: {
        type: String
        
    },
    company_id: {
        type: String
    },
    isnull: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Category', CategorySchema, "Category");