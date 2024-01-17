var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: Number,
        default: 0
    },
    address: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now()
    },
    message_code: {
        type: String
    },
    status: {
        type: String,
        default: "0"
    },
    type: {
        type: String,
        default: "0"
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('EndUser', UserSchema, 'EndUser');