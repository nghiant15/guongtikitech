var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const uuid = require('uuid');
const OrderDetail = new Schema({
    OrderID: {
        type: String,
        trim: true,
        required: true
    },
    HardWareID: {
        type: String,
        trim: true
    },
    Company_Id: {
        type: String,
        trim: true,
        ref: "Company"
    },
    Purcharse_Date: {
        type: Date,
        default: Date.now()
    },
    Active_Date: {
        type: Date,
        default: Date.now()
    },
    Create_At:{
        type: Date,
        default: Date.now()
    },
    Status: {
        type: String,
        default: "SPENDING"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('OrderDetail', OrderDetail, 'OrderDetail');