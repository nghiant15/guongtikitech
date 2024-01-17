const ObjectId = require('mongodb').ObjectId
const MultiImageModel = require('../../models/Hardward/MultiImageModel')
const Response = require('../../helpers/Response');

module.exports = {
    //User Table
    getListMultiImage: async (req, res) => {
        try {
            const dataMultiImage = await MultiImageModel.find({ isdelete: false }).lean()
             
            res.send(Response(200, "Lấy dữ liệu thành công", dataMultiImage, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getMultiImageByProduct: async (req, res) => {
        try {
            const dataMultiImage = await MultiImageModel.find({ isdelete: false, product_id: req.body.product_id }).lean()
             
            res.send(Response(200, "Lấy dữ liệu thành công", dataMultiImage, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addMultiImage: async (req, res) => {
        try {
            const { product_id, image } = req.body;
            const count = await MultiImageModel.countDocuments({
                "product_id": product_id
            });

            if(count < 5) {
                const result = await MultiImageModel.create({
                    "product_id": product_id,
                    "image": image
                });
                if (result) {
                    res.send(Response(200, "Thêm danh mục thành công", result, true));
                } else {
                    res.send(Response(202, result, [], false));
                }
            } else {
                res.send(Response(202, "Sản phẩm giới hạn bởi 5 hình ảnh !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    updateMultiImage: async (req, res) => {
        try {
            const { id, image } = req.body;
            
            const objUpdate = {
                "image": image
            };

            let result = await MultiImageModel.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addImage: async (req, res) => {
        const data = req.file;
        res.send(Response(200, "Thành công", data, true));

    },
}