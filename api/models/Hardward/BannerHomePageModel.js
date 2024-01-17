const mongoose = require('mongoose');

const BannerHomePageSchema = new mongoose.Schema({
    image: {
        type: String,
        trim: true
    },
    link: {
        type: String
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('BannerHomePage', BannerHomePageSchema, "BannerHomePage");