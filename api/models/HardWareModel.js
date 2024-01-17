var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const HardWare = new Schema({
    Name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    Create_Date: {
        type: Date,
        default: Date.now()
    },
    Active_Date: {
        type: Date,
        default: Date.now()
    },
    End_Date: {
        type: Date
    },
    Key: {
        type: String,
        default: uuidv4
    },
    HardWare_Name: {
        type: String
    },
    Call_Name: {
        type: String
    },
    Serial_Number: {
        type: String
    },
    UniqueID: {
        type: String
    },
    Status: {
        type: String,
        default: "INSTOCK"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('HardWare', HardWare, 'HardWare');