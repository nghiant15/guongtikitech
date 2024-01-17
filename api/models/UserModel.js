var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator').default;

const User = new Schema({
    Name: {
        type: String,
        trim: true,
        unique: true,
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
    Phone: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    Gender: {
        type: String,
        trim: true
    },
    Address: {
        type: String
    },
    Company_Id: {
        type: String,
        trim: true,
        ref: "Company"
    },
    Role_Id: {
        type: String,
        trim: true,
        ref: "Role"
    },
    UserName: {
        type: String
    },
    Password: {
        type: String,
        required: true
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
    Code: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', User, 'User');