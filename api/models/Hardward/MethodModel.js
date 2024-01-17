const mongoose = require('mongoose');

const MethodSchema = new mongoose.Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Method', MethodSchema, "Method");