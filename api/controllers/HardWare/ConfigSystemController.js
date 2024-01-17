const ObjectId = require('mongodb').ObjectId
const ConfigSystemModel = require('../../models/Hardward/ConfigSystemModel')
const Response = require('../../helpers/Response');

module.exports = {
    listConfigSystem: async (req, res) => {
        try {
            var result = await ConfigSystemModel.find({
                isDelete: false
            }).lean()

            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    listConfigSystem_By_ID: async (req, res) => {
        try {
            var result = await ConfigSystemModel.findOne({
                isDelete: false, 
                company_id: req.body.company_id
            }).lean()
            console.log(req.body.company_id)
            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", {}, false));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateConfigSystem: async (req, res) => {
        try {
            const { company_id, code, type, value } = req.body;
            const count = await ConfigSystemModel.count({ company_id: company_id });
            if(count > 0) {
                const result = await ConfigSystemModel.updateOne({ company_id: company_id }, { type: type, value: value });

                if (result) {
                    res.send(Response(200, "Cập nhật dữ liệu thành công !!!", result, true));
                } else {
                    res.send(Response(202, "Cập nhật dữ liệu thất bại !!!", [], false));
                }
            } else {
                const result = await ConfigSystemModel.create({
                    company_id: company_id,
                    code: code,
                    type: type,
                    value: value,
                });

                if (result) {
                    res.send(Response(200, "Cập nhật dữ liệu thành công !!!", result, true));
                } else {
                    res.send(Response(202, "Cập nhật dữ liệu thất bại !!!", [], false));
                }
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

}