const mongoose = require('mongoose');

const ProductSuggestModelSchema = new mongoose.Schema({
   
    name: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    linkdetail: {
        type: String
    },
    sdktype: {
        type: String
    },
    level: {
        type: String
    },
    companyid: {
        type: String

    },
    brand: {
        type: String
        
    }

});

module.exports = mongoose.model('tb_product_suggest', ProductSuggestModelSchema);