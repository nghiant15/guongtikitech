const mongoose = require('mongoose');

const MultiImage = new mongoose.Schema({
    product_id: {
        type: String
    },
    image: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('MultiImage', MultiImage, "MultiImage");