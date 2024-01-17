var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Key = new Schema({
    Name: {
        type: String,
        trim: true,
        required: true
    },
    Company_Id: {
        type: String,
        trim: true
    },
    Type_Key: {
        type: String
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Start_Date: {
        type: Date
    },
    End_Date: {
        type: Date
    },
    Status: {
        type: String,
        default: "INSTOCK"
    },
    Value: {
        type: String,
        unique: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Key', Key, 'Key');