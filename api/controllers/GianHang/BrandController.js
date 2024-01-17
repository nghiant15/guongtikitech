const ObjectId = require('mongodb').ObjectId
const BrandModel = require('../../models/Hardward/BrandModel')
const Response = require('../../helpers/Response');


module.exports = {
    listBrand: async (req, res) => {
        try {
            if(req.role == "ADMIN") {
                var result = await BrandModel.find({
                    isDelete: false
                }).populate("shop_id").lean()
            } else if(req.role == "COMPANY" || req.role == "SALES") {
                var result = await BrandModel.find({
                    isDelete: false, company_id: req.user.Company_Id
                }).populate("shop_id").lean()
            }

            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addBrand: async (req, res) => {
        try {
            const { name, shop_id, image } = req.body;
            const role = req.role;
            const result = await BrandModel.create({
                name: name,
                shop_id: role == "COMPANY" || role == "SALES" ? shop_id : req.user._id,
                image: image,
                company_id: req.user.Company_Id
            });

            if (result) {
                res.send(Response(200, "Thêm dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Thêm dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    updateBrand: async (req, res) => {
        try {
            const { name, shop_id, image, id } = req.body;
            const role = req.role;
            const result = await BrandModel.updateOne({ _id: ObjectId(id) }, {
                name: name,
                shop_id: role == "COMPANY" || role == "SALES" ? shop_id : req.user._id,
                image: image
            });

            if (result) {
                res.send(Response(200, "Cập nhật dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Cập nhật dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    deleteBrand: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await BrandModel.updateOne({ _id: ObjectId(body.id) }, objDelete);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    addImage: async (req, res) => {
        console.log(req.file)
        res.send("Ok")

    },
}