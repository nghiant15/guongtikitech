var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator').default;
const Company = new Schema({
    Name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        trim: true,
        required: true,
        validate: v => {
            if (!validator.default.isEmail(v)) {
                throw Error("Invalid Email address");
            }
        }
    },
    Phone: {
        type: String,
        trim: true,
        unique: true
    },
    Fax: {
        type: String,
        trim: true
    },
    Address: {
        type: String
    },
    Phone: {
        type: String,
        trim: true
    },
    Website: {
        type: String
    },
    Logo: {
        type: String
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Status: {
        type: String,
        default: "Deactived"
    },
    Code: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Company', Company, 'Company');