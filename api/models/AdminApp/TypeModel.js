const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    company_id: {
        type: String,
    },
});

module.exports = mongoose.model('tb_type_makeup', TypeSchema);