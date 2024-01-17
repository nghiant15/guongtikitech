const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('tb_type_makeup', TypeSchema);