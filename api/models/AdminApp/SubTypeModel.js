const mongoose = require('mongoose');

const SubTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    type_id:{
        type: mongoose.Types.ObjectId,
        trim: true
    },
    company_id: {
        type: String,
    },
    image: {
        type: String,
        trim: true
    },
    vi: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('tb_sub_type_makeup', SubTypeSchema);