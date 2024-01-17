var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const TypeKey = new Schema({
    Name: {
        type: String,
        trim: true,
        required: true
    },
    Create_Date: {
        type: Date,
        default: Date.now()
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

module.exports = mongoose.model('TypeKey', TypeKey, 'TypeKey');