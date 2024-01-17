const ObjectId = require('mongodb').ObjectId
const HardWare = require('../models/HardWareModel')
const OrderDetail = require('../models/OrderDetailModel')
const Key = require('../models/KeyModel')
const Response = require('../helpers/Response');

module.exports = {
    getOrder: async (req, res) => {
        try {
            const { id } = req.query;
            const { company_id } = req.body;

            if (id == null) {
                var result = await OrderDetail.find({ isDelete: false, Company_Id: company_id });
            } else {
                var result = await OrderDetail.findOne({ _id: id, isDelete: false, Company_Id: company_id  });
            }

            console.log(result)
            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },
    getDataByKey: async (req, res) => {
        try {
            const { key } = req.body;

            var result = await OrderDetail.find({ isDelete: false, HardWareID: key }, `Company_Id`)
            .sort({ _id: -1 }).populate("Company_Id").limit(1).lean();

            if(result) {
                if( result[0].Company_Id.Logo == undefined || result[0].Company_Id.Logo == null ) {
                    result[0].Company_Id.Logo = ""
                } else {
                    result[0].Company_Id.Logo = `https://admin-api.tikitech.vn/public/logo_company/${result[0].Company_Id.Logo}`
                }
                res.send(Response(200, "Lấy dữ liệu thành công !!!", result[0], true));
            } else {
                res.send(Response(202, "Lấy dữ liệu không thành công !!!", [], false));
            }
            
        } catch (err) {
            res.send(Response(202, "Có lỗi đã xảy ra !!!", err, false));
        }
    },
}