const ObjectId = require('mongodb').ObjectId
const CategoryModel = require('../../models/Hardward/CategoryModel')
const Response = require('../../helpers/Response');


module.exports = {
    listCategory: async (req, res) => {
        try {
            if(req.role == "ADMIN") {
                var result = await CategoryModel.find({
                    isDelete: false
                }).populate("shop_id").lean()
            } else if(req.role == "COMPANY" || req.role == "SALES") {
                var result = await CategoryModel.find({
                    isDelete: false, company_id: req.user.Company_Id
                }).populate("shop_id").lean()
            }

            console.log(result)
            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addCategory: async (req, res) => {
        try {
            const { name, product_id, image } = req.body;
            const role = req.role;
            const result = await CategoryModel.create({
                name: name,
                image: image,
                product_id: product_id,
                company_id: req.user.Company_Id,
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

    updateCategory: async (req, res) => {
        try {
            const { name, product_id, image, id } = req.body;
            const role = req.role;
            const result = await CategoryModel.updateOne({ _id: ObjectId(id) }, {
                name: name,
                image: image,
                product_id: product_id
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

    deleteCategory: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await CategoryModel.updateOne({ _id: ObjectId(body.id) }, objDelete);

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