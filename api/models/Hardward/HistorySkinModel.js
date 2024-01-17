var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const HistorySkin = new Schema({
    UserName: {
        type: String
    },
    Result: {
        type: String
    },
    Customer_Phone: {
        type: String
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Image: {
        type: String
    },
    Company_Id: {
        type: String,
        ref: "Company"
    },
    Sale_Id: {
        type: String,
        ref: "User"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('HistorySkin', HistorySkin, 'HistorySkin');