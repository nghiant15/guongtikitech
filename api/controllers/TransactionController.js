const ObjectId = require('mongodb').ObjectId
const Transaction = require('../models/TransactionModel')
const HardWare = require('../models/HardWareModel')
const OrderDetail = require('../models/OrderDetailModel')
const Key = require('../models/KeyModel')
const CustomerCheckOut = require('../models/CustomerCheckOutModel')
const Company = require('../models/CompanyModel')
const Response = require('../helpers/Response');

module.exports = {
    getTransaction: async (req, res) => {
        try {
            const company = await Company.find({}, `Name`);
            var result = await Transaction.find({ isDelete: false }).lean()

            let data = [];
            result.map((val) => {
                const com = company.filter((v) => String(v["_id"]) == String(val["Company_Id"]));
                
                data.push(
                    Object.assign(val, {
                        company_name: com[0] == undefined ? "" : com[0].Name,
                    })
                );
            });

            if (result) {
                res.send(Response(200, "Thành công", data, true));
            } else {
                res.send(Response(202, "Thất bại", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Đã xảy ra lỗi ở: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addTransaction: async (req, res) => {
        try {
            let body = req.body;
            const result = await Transaction.create({
                "Company_Id": body.company_id
            });
            if (result) {
                var dataDetail = await OrderDetail.find({ isDelete: false, Company_Id: body.company_id });
                for (let i = 0; i < dataDetail.length; i++) {
                    await CustomerCheckOut.create({
                        "Transaction_ID": result._id,
                        "HardWard_ID": dataDetail[i].HardWareID
                    });
                    await HardWare.updateOne({ Key: dataDetail[i].HardWareID }, { Status: 'ACTIVED' });
                    await Key.updateOne({ Value: dataDetail[i].HardWareID },
                        {
                            Status: 'ACTIVED',
                            Start_Date: Date.now(),
                            End_Date: new Date().setFullYear(new Date().getFullYear() + 1)
                        }
                    );
                }
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
            }

            let result = await Order.updateOne({ _id: body.id }, objUpdate);
            if (result) {
                await OrderDetail.updateOne({ OrderID: body.id }, {
                    "Status": "Active"
                });

                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }
}