const mongoose = require('mongoose');

const StatusCompanySchema = new mongoose.Schema({
    company_id: {
        type: String
    },
    status: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('StatusCompany', StatusCompanySchema, "StatusCompany");