const ObjectId = require('mongodb').ObjectId
const HardWare = require('../models/HardWareModel')
const Order = require('../models/OrderModel')
const Transaction = require('../models/TransactionModel')
const OrderDetail = require('../models/OrderDetailModel')
const Key = require('../models/KeyModel')
const Response = require('../helpers/Response');

module.exports = {
    getOrder: async (req, res) => {
        try {
            const { id } = req.query;

            if (id == null) {
                var result = await Order.find({ isDelete: false, Status: 'SPENDING' })
                .populate("Company_Id", `Name`).lean();
            } else {
                var result = await Order.findOne({ _id: id, isDelete: false }).populate("Company_Id", `Name`).lean();
            }
           
            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getDataOrderDetail: async (req, res) => {
        try {
            var result = await OrderDetail.aggregate([
                { $match : { isDelete: false, Company_Id: req.company_id } },
                { 
                    $lookup: { 
                        from: "HardWare", 
                        localField: "HardWareID", 
                        foreignField: "Key", 
                        as: "HardWareID" 
                    } 
                },
            ])
            
            if(result) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateStatusHardware: async (req, res) => {
        try {
            const { id, status } = req.body
            var result = await OrderDetail.updateOne({ _id: id }, { Status: status });
            
            if(result) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addOrder: async (req, res) => {
        var user = req.user;
        try {
            const { Company_Id, Count, arrHard } = req.body;
            const result = await Order.create({
                "Company_Id": Company_Id,
                "Sale_Id": user._id,
                "Count": Count
            });
            if (result) {
                for (let i = 0; i < arrHard.length; i++) {
                    await OrderDetail.create({
                        "OrderID": result._id,
                        "HardWareID": arrHard[i][0].Key,
                        "Company_Id": Company_Id
                    });
    
                    await HardWare.updateOne({ _id: ObjectId(arrHard[i][0]._id) }, {Status: 'AVAILABLE'});
                    await Key.updateOne({ Value: arrHard[i][0].Key }, {Status: 'AVAILABLE'});
                }
                res.send(Response(200, "Thêm đơn hàng thành công !!!", result, true));
            } else {
                res.send(Response(202, "Thêm đơn hàng thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Có lỗi xảy ra ở trường dữ liệu: " + JSON.stringify(err.errors.Company_Id.message), err, false));
        }
    },

    
    checkStatusHardWareOfCompany: async (req, res) => {
        try {
            const { uniqueid } = req.body;
            console.log(req.body);
            
            const resHardWare = await HardWare.findOne({ isDelete: false, UniqueID: uniqueid }).lean()

            if(resHardWare) {
                const resOrderDetail = await OrderDetail.findOne({ isDelete: false, HardWareID: resHardWare.Key }).lean();
                if(resOrderDetail) {
                    res.send(Response(202, resOrderDetail.Status, resOrderDetail, false));
                } else {
                    res.send(Response(202, "Không tìm thấy phần cứng cần lấy, kiểm tra Unique ID truyền vào !!!", {}, false));
                }
            } else {
                res.send(Response(202, "Không tìm thấy phần cứng cần lấy, kiểm tra Unique ID truyền vào !!!", {}, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getInfoDivice: async (req, res) => {
        try {
            const { uniqueid } = req.body;
            
            const resHardWare = await HardWare.findOne({ isDelete: false, UniqueID: uniqueid }).lean()

            if(resHardWare) {
                const resOrderDetail = await OrderDetail.findOne({ isDelete: false, HardWareID: resHardWare.Key }).lean();
                if(resOrderDetail) {
                    res.send(Response(202, resOrderDetail.Status, resOrderDetail, false));
                } else {
                    res.send(Response(202, "Không tìm thấy phần cứng cần lấy, kiểm tra Unique ID truyền vào !!!", {}, false));
                }
            } else {
                res.send(Response(202, "Không tìm thấy phần cứng cần lấy, kiểm tra Unique ID truyền vào !!!", {}, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    checkStatusHardWare: async (req, res) => {
        try {
            const { key } = req.body;
            var result = await HardWare.findOne({ isDelete: false, Key: key }).lean()
            if(result) {
                res.send(Response(200, `${result.Status}`, result, true));
            } else {
                res.send(Response(202, "Phần cứng không tồn tại !!!", {}, false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },


    updateStatus: async (req, res) => {
        try {
            let body = req.body;
            const objUpdate = {
                "Status": body.Status,
                "Active_Date": Date.now()
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