const ObjectId = require('mongodb').ObjectId
const Product = require('../../models/Hardward/ProductModel')
const Response = require('../../helpers/Response');
module.exports = {
    listProduct: async (req, res) => {
        try {
            const role = req.role;
            if (role == "ADMIN") {
                var result = await Product.find({
                    isDelete: false
                })
                    .populate("brand_id")
                    .populate("category_id").
                    populate("shop_id").lean();
            } else if (role == "COMPANY" || role == "SALES") {
                var result = await Product.find({
                    isDelete: false, company_id: req.user.Company_Id
                })
                    .populate("brand_id")
                    .populate("category_id")
                    .populate("shop_id").lean();
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

    listProductByCompany: async (req, res) => {
        try {
            var result = await Product.find({
                isDelete: false, company_id: req.body.company_id
            }).populate("brand_id").populate("category_id").populate("shop_id").lean();

            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", [], true));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    searchData: async (req, res) => {
        try {
            let dataProduct = await Product.find({ isdelete: false, name: new RegExp(req.query.key, "i") })
            if (dataProduct) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataProduct, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, JSON.stringify(err.keyValue), err, false));
        }
    },

    getProductById: async (req, res) => {
        try {
            const { slug } = req.body
            let dataProduct = await Product.find({ isdelete: false, slug: slug })
                .populate("category_id", `name image`)
                .populate("brand_id", `name image`)
                .lean();

            let dataDeal = await Deal.find({ isdelete: false, status: "0", $or: [{ type: "0" }, { type: "1" }] })
                .populate("category.product.product_id", `name image brand_id price slug total_deal weight`)
                .populate("category.category_id")
                .lean()

            var total_deal = "";
            var voucher = "";
            var time_start = "";
            var time_finish = "";

            for (let i = 0; i < dataDeal.length; i++) {
                time_start = dataDeal[i].time_start;
                time_finish = dataDeal[i].time_finish;
                let dataTemp = dataDeal[i].category;
                for (let y = 0; y < dataTemp.length; y++) {
                    let dataProduct = dataTemp[y].product.find(val => val.product_id.slug == slug);
                    if (dataProduct != undefined) {
                        total_deal = dataProduct.total_deal;
                        voucher = dataDeal[i].voucher;
                    }
                }
            }

            var countOrder = await CountOrder.countDocuments({ product_id: dataProduct.length > 0 ? dataProduct[0]._id : "" }).lean();

            if (countOrder < Number(total_deal)) {
                let calculator = (50 - Number(voucher)) / (Number(total_deal) - Number(countOrder))
                let price = Number(dataProduct[0].price) - (Number(dataProduct[0].price) * (Number(voucher) + Number(calculator)) / 100)

                let pro = [];
                dataProduct.map(val => {
                    console.log(price)
                    pro.push(Object.assign(val, { price_after_discount: Math.round(price), time_start: time_start, time_finish: time_finish }));
                })

                if (dataProduct) {
                    res.send(Response(200, "Lấy dữ liệu thành công", dataProduct, true));
                } else {
                    res.send(Response(202, "Lấy dữ liệu thất bại", [], false));
                }
            } else {
                let calculator = (50 - Number(voucher)) / (Number(total_deal) - Number(countOrder))
                let price = Number(dataProduct[0].price) - (Number(dataProduct[0].price) * (Number(voucher) + Number(calculator)) / 100)

                let pro = [];

                dataProduct.map(val => {
                    pro.push(Object.assign(val, { price_after_discount: Math.round(price), time_start: time_start, time_finish: time_finish }));
                })


                res.send(Response(200, "Số lượng deal đã đạt giới hạn, mặt hàng này đã ngừng deal hoặc không tồn tại!!!", dataProduct, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListProductByCategory: async (req, res) => {
        try {
            var dataProduct = await Product.find({ isdelete: false, category_id: req.body.category_id })
                .populate("brand_id")
                .populate("category_id")
                .lean()

            let dataDeal = await Deal.find({ isdelete: false, status: "0", $or: [{ type: "0" }, { type: "1" }] })
                .populate("category.product.product_id", `name image brand_id price slug total_deal weight`)
                .populate("category.category_id")
                .lean()

            let arrSlug = []

            for (let y = 0; y < dataDeal.length; y++) {
                let dataTemp = dataDeal[y].category;
                for (let z = 0; z < dataTemp.length; z++) {
                    for (let i = 0; i < dataProduct.length; i++) {
                        let dataZ = dataTemp[z].product.find(val => val.product_id.slug == dataProduct[i].slug);
                        if (dataZ == undefined) {
                            arrSlug.push(dataProduct[i])
                        }
                    }
                }
            }


            if (dataDeal.length > 0) {
                if (dataDeal) {
                    res.send(Response(200, "Lấy dữ liệu thành công", arrSlug, true));
                } else {
                    res.send(Response(200, "Lấy dữ liệu thất bại", [], true));
                }
            } else {
                if (dataProduct) {
                    res.send(Response(200, "Lấy dữ liệu thành công", dataProduct, true));
                } else {
                    res.send(Response(200, "Lấy dữ liệu thất bại", [], true));
                }
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getInfoByCode: async (req, res) => {
        try {

            var result = await Product.find({
                sku_code: req.body.data_order, isDelete: false
            }).populate("shop_id", "Name").populate("brand_id", "name image").lean()

            if (result) {
                let arrRes = []

                result.map(async (val) => {
                    arrRes.push(Object.assign(val, { image: "https://admin-api.tikitech.vn/public/image_product/" + val.image }));
                });
                res.send(Response(200, "Lấy danh sách thành công !!!", arrRes.length > 0 ? arrRes[0] : [], true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getInfoByID: async (req, res) => {
        try {
            var result = await Product.findOne({
                _id: req.body.id
            }).populate("shop_id", "Name").populate("brand_id", "name image").lean()

            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addProduct: async (req, res) => {
        try {
            const role = req.role;

            const { name, link, image, price, code, brand_id, shop_id, sku_code, category_id,
                weight, info_product, how_to_use, description, description_brand } = req.body;

            const result = await Product.create({
                name: name,
                shop_id: role == "COMPANY" || role == "SALES" ? shop_id : req.user._id,
                image: image,
                link: link,
                price: price,
                sku_code: sku_code,
                category_id: category_id,
                code: code,
                brand_id: brand_id,
                weight: weight,
                info_product: info_product,
                how_to_use: how_to_use,
                description: description,
                description_brand: description_brand,
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

    updateProduct: async (req, res) => {
        try {
            const { name, link, image, price, code, brand_id, shop_id, sku_code, id, category_id, weight, info_product, how_to_use, description, description_brand } = req.body;
            const role = req.role;
            console.log(category_id)
            console.log(id)
            const result = await Product.updateOne({ _id: ObjectId(id) }, {
                name: name,
                shop_id: role == "COMPANY" || role == "SALES" ? shop_id : req.user._id,
                image: image,
                link: link,
                price: price,
                category_id: category_id,
                code: code,
                sku_code: sku_code,
                brand_id: brand_id,
                weight: weight,
                info_product: info_product,
                how_to_use: how_to_use,
                description: description,
                description_brand: description_brand,
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

    deleteProduct: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await Product.updateOne({ _id: ObjectId(body.id) }, objDelete);

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
        try {
            console.log(req.file)
            res.send("Ok")
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },
}