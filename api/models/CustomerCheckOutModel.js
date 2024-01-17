var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const uuid = require('uuid');
const currentDate = new Date();
const CustomerCheckOut = new Schema({
    Transaction_ID: {
        type: String,
        trim: true,
        required: true
    },
    HardWard_ID: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: 'ENABLE'
    },
    Active_Date: {
        type: Date,
        default: Date.now()
    },
    End_Date: {
        type: Date,
        default: currentDate.setFullYear(currentDate.getFullYear() + 1)
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('CustomerCheckOut', CustomerCheckOut, 'CustomerCheckOut');