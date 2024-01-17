var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const PackageSaleLog = new Schema({
    Sale_Id: {
        type: String,
        required: true
    },
    Package_Id: {
        type: String,
        required: true
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    End_Date: {
        type: Date
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

module.exports = mongoose.model('PackageSalesLog', PackageSaleLog, 'PackageSalesLog ');