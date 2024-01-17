const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
    userID: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    image_type: {
        type: String,
        trim: true
    },
    created_at: {
        type: Number,
        index: true,
    },
});

// UploadSchema.pre('save',  function(next) {
//     const user = this;
//     next();
// });

module.exports = mongoose.model('tb_user_upload', UploadSchema);