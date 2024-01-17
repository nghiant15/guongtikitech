var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const SEOInfoSchema = new Schema({
    product_id: {
        type: String
    },
    title: {
        type: String
    },
    image: {
        type: String
    },
    author: {
        type: String
    },
    keyword: {
        type: String
    },
    description: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('SEOInfo', SEOInfoSchema, 'SEOInfo');