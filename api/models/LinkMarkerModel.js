var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const LinkShop = new Schema({
    Company_Id: {
        type: String,
        trim: true,
        unique: true
    },
    link_shop: {
        type: String,
        default: "https://test.com"
    },
    link_recommand: {
        type: String,
        default: "https://test.com"
    },
    link_sku_hair: {
        type: String,
        default: "https://test.com"
    },
    Status: {
        type: String,
        default: "Actived"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('LinkShop', LinkShop, 'LinkShop');