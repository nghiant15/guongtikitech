const mongoose = require('mongoose');

const VNPayTransactionSchema = new mongoose.Schema({
    order_id: {
        type: String,
        ref: "Order"
    },
    vnp_TmnCode: {
        type: String,
        required: true
    },
    vnp_Amount: {
        type: Number,
        required: true
    },
    vnp_BankCode: {
        type: String,
        required: true
    },
    vnp_BankTranNo: {
        type: String
    },
    vnp_CardType: {
        type: String
    },
    vnp_PayDate: {
        type: Date
    },
    vnp_OrderInfo: {
        type: String,
        required: true
    },
    vnp_TransactionNo: {
        type: Number,
        required: true
    },
    vnp_ResponseCode: {
        type: Number,
        required: true
    },
    vnp_TransactionStatus: {
        type: Number,
        required: true
    },
    vnp_TxnRef: {
        type: String,
        required: true
    },
    vnp_SecureHashType: {
        type: String
    },
    vnp_SecureHash: {
        type: String,
        required: true
    },
    isdelete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('VNPayTransaction', VNPayTransactionSchema, 'VNPayTransaction');