const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    age:{
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean
    },
    dateUpdate:{
        type: Number
    },
    device: {
        type: Object,
        trim: true
    }
});

module.exports = mongoose.model('tb_user', UserSchema);