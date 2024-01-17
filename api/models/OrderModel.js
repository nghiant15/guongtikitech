var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const uuid = require('uuid');
const Order = new Schema({
    Company_Id: {
        type: String,
        trim: true,
        required: true,
        ref: "Company"
    },
    Sale_Id: {
        type: String,
        trim: true
    },
    Purcharse_Date: {
        type: Date,
        default: Date.now()
    },
    Active_Date: {
        type: Date,
        default: Date.now()
    },
    Count: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Order', Order, 'Order');