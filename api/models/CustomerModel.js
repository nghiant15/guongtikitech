var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Customer = new Schema({
    Name: {
        type: String,
        trim: true,
        required: true
    },
    Email: {
        type: String,
    },
    Phone: {
        type: String,
        trim: true,
        required: true
    },
    Password: {
        type: String,
        default: "1"
    },
    Gender: {
        type: String,
        trim: true
    },
    Company_Id: {
        type: String,
        trim: true,
        ref: "Company"
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Status: {
        type: String,
        default: "Actived"
    },
    Sale_Id: {
        type: String,
        ref: "User"
    },
    Skin_Status: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Customer', Customer, 'Customer');