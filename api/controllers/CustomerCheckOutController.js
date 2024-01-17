const ObjectId = require('mongodb').ObjectId
const CustomerCheckOut = require('../models/CustomerCheckOutModel')
const Key = require('../models/KeyModel')
const Transaction = require('../models/TransactionModel')
const HardWare = require('../models/HardWareModel')
const Response = require('../helpers/Response');

module.exports = {
    getCheckOut: async (req, res) => {
        try {
            var body = req.body;
            var result = await CustomerCheckOut.find(body.condition);

            if(result){
                res.send(Response(200, "Thành công", result, true));
            } else {
                res.send(Response(202, "Thất bại", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Đã xảy ra lỗi ở: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addCheckOut: async (req, res) => {
        try {
            let body = req.body;
            const result = await CustomerCheckOut.create({
                "Transaction_ID": body.Transaction_ID,
                "HardWard_ID": body.HardWard_ID
            });
            if (result) {
                await HardWare.updateOne({ _id: ObjectId(body.HardWard_ID) }, {Status: 'ACTIVED'});
                res.send(Response(200, "Thành công", result, true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    updateStatus: async (req, res) => {
        try {
            let body = req.body;
            const objUpdate = {
                "Status": body.Status
            };

            let result = await CustomerCheckOut.updateOne({ _id: ObjectId(body.id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getDataHardWareByCheckOut: async (req, res) => {
        try {
            let body = req.body;
            var arrTemp = [];
            var arrFilter = [];
            var resultTrans = await Transaction.find({
                "Company_Id": req.company_id
            });

            if (resultTrans) {
                for(let i = 0; i < resultTrans.length; i++){
                    var resCheckOut = await CustomerCheckOut.find({
                        "Transaction_ID": resultTrans[i]._id
                    });
                    
                    arrTemp = arrTemp.concat(resCheckOut)
                }

                var resultKey = await Key.find({ isDelete: false, Status: 'DISABLE' });
                if (resultKey.length == 0) {
                    res.send(Response(200, "Get checkout success !!!", arrTemp, false));
                } else {
                    for (let i = 0; i < arrTemp.length; i++) {
                        for (let y = 0; y < resultKey.length; y++) {
                            if (arrTemp[i].HardWard_ID == resultKey[y].Value) {
                                arrTemp.splice(i, 1);
                            }
                        }
                    }

                    res.send(Response(200, "Thành công", arrTemp, true));
                }
            } else {
                res.send(Response(202, "Can not get transaction !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

}