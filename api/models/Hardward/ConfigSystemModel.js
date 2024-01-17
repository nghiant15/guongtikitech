const mongoose = require('mongoose');

const ConfigSystemSchema = new mongoose.Schema({
    company_id: {
        type: String
    },
    code: {
        type: String
    },
    type: {
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

module.exports = mongoose.model('ConfigSystem', ConfigSystemSchema, "ConfigSystem");