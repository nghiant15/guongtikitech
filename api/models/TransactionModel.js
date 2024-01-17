var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const uuid = require('uuid');
const currentDate = new Date();
const TransactionOrder = new Schema({
    Company_Id: {
        type: String,
        trim: true,
        required: true,
        ref: "Company"
    },
    Status: {
        type: String,
        default: "ACTIVE"
    },
    Active_Date: {
        type: Date,
        default: Date.now()
    },
    Create_At: {
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

module.exports = mongoose.model('TransactionOrder', TransactionOrder, 'TransactionOrder');