const ObjectId = require('mongodb').ObjectId
const VNPayTransactionModel = require('../../models/Hardward/VNPayTransactionModel')
const Response = require('../../helpers/Response');

module.exports = {
    addVNPaytransaction: async (req, res) => {
        try {
            const { order_id, vnp_TmnCode, vnp_Amount, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_PayDate,
                vnp_OrderInfo, vnp_TransactionNo, vnp_ResponseCode, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHashType,
                vnp_SecureHash } = req.body;
            const result = await VNPayTransactionModel.create({
                order_id: order_id,
                vnp_TmnCode: vnp_TmnCode,
                vnp_Amount: vnp_Amount,
                vnp_BankCode: vnp_BankCode,
                vnp_BankTranNo: vnp_BankTranNo,
                vnp_CardType: vnp_CardType,
                vnp_PayDate: vnp_PayDate,
                vnp_OrderInfo: vnp_OrderInfo,
                vnp_TransactionNo: vnp_TransactionNo,
                vnp_ResponseCode: vnp_ResponseCode,
                vnp_TransactionStatus: vnp_TransactionStatus,
                vnp_TxnRef: vnp_TxnRef,
                vnp_SecureHashType: vnp_SecureHashType,
                vnp_SecureHash: vnp_SecureHash,
            });

            if (result) {
                res.send(Response(200, "Thêm vnpay transaction thành công !!!", result, true));
            } else {
                res.send(Response(202, "Thêm vnpay transaction thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },
    
    getVNPayTransactionByOrder: async (req, res) => {
        try {
            const { order_id } = req.body
            var dataVNPayTransaction = await VNPayTransactionModel.findOne({ isdelete: false, order_id: order_id }).lean()
            
            if(dataVNPayTransaction) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataVNPayTransaction, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", {}, false));
            }
            
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

}