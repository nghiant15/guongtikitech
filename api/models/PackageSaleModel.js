var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const PackageSale = new Schema({
    Name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    Company_Id: {
        type: String,
        trim: true
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

module.exports = mongoose.model('PackageSales', PackageSale, 'PackageSales');