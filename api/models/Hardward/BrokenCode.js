const mongoose = require('mongoose');

const BrokenCodeSchema = new mongoose.Schema({
    code: {
        type: String
    },
    value: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('BrokenCode', BrokenCodeSchema, "BrokenCode");