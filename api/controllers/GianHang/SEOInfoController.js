const ObjectId = require('mongodb').ObjectId
const SEOInfoModel = require('../../models/Hardward/SEOInfoModel')
const Response = require('../../helpers/Response');

module.exports = {
    //User Table
    getListSEOInfo: async (req, res) => {
        try {
            var dataSEOInfoModel = await SEOInfoModel.find({ isdelete: false }).populate("product_id").lean()
             
            res.send(Response(200, "Lấy dữ liệu thành công", dataSEOInfoModel, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getSEOInfoByProduct: async (req, res) => {
        try {
            var dataSEOInfoModel = await SEOInfoModel.findOne({ isdelete: false, product_id: req.body.product_id }).lean()
            if(dataSEOInfoModel) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataSEOInfoModel, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addSEOInfo: async (req, res) => {
        try {
            const { product_id, title, keyword, description, image, author } = req.body;
            const result = await SEOInfoModel.create({
                product_id: product_id,
                title: title,
                image: image,
                author: author,
                keyword: keyword,
                description: description,
            });
            if (result) {
                res.send(Response(200, "Thêm thành công", result, true));
            } else {
                res.send(Response(202, result, [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateSEOInfo: async (req, res) => {
        try {
            const { product_id, title, keyword, description, image, author } = req.body;
            
            const objUpdate = {
                title: title,
                keyword: keyword,
                image: image,
                author: author,
                description: description,
            };

            let count = await SEOInfoModel.countDocuments({ product_id: product_id }).lean();
            if(count > 0) {
                let result = await SEOInfoModel.updateOne({ product_id: product_id }, objUpdate).lean();

                if (result) {
                    res.send(Response(200, "Cập nhật thành công !!!", [], true));
                } else {
                    res.send(Response(202, "Cập nhật thát bại !!!", [], false));
                }
            } else {
                const result = await SEOInfoModel.create({
                    product_id: product_id,
                    title: title,
                    image: image,
                    author: author,
                    keyword: keyword,
                    description: description,
                });
                if (result) {
                    res.send(Response(200, "Thêm thành công", result, true));
                } else {
                    res.send(Response(202, result, [], false));
                }
            }
        
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteSEOInfo: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await SEOInfoModel.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Thành công", [], true));
        } else {
            res.send(Response(202, "Thất bại", [], false));
        }

    },

    addImage: async (req, res) => {
        console.log(req.file)
        res.send("Ok")

    },
}