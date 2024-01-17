var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator').default;

const KeyOrder = new Schema({
    UserName: {
        type: String,
        trim: true,
        required: true
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
    Company_Id: {
        type: String
    },
    Address: {
        type: String
    },
    Phone: {
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
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('KeyOrder', KeyOrder, 'KeyOrder');