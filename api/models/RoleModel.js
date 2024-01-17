var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Role = new Schema({
    Name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Array_Role: {
        type: Array
    },
    Status: {
        type: String,
        default: "Deactived"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Role', Role, 'Role');