const ObjectId = require('mongodb').ObjectId
const Deal = require('../../models/Hardward/DealModel')
const CountOrder = require('../../models/Hardward/CountOrderModel')
const BrandModel = require('../../models/Hardward/BrandModel')
const Response = require('../../helpers/Response');
const lodash = require('lodash')

function showName(key) {
    switch (key) {
        case "0":
            return "Ưu đãi mới nhất"
        case "1":
            return "Ưu đãi đang diễn ra"
        case "2":
            return "Ưu đã đã kết thúc"
        default:
            return "Không xác định"
    }
}

module.exports = {
    //Deal Table
    getListDeal: async (req, res) => {
        try {
            var dataDeal = await Deal.find({ isdelete: false, status: "0", $or: [{ type: "0" }, { type: "1" }] })
                .populate("category.product.product_id", `name image brand_id price slug total_deal info_product description description_brand how_to_use`)
                .populate("category.category_id")
                .lean()

            let grouppedArray = lodash.chain(dataDeal).groupBy("type")
                .map((value, key) => ({ type: showName(key), data: value }))
                .value()

            for (let i = 0; i < grouppedArray.length; i++) {
                let dataDeal = grouppedArray[i].data;
                for (let y = 0; y < dataDeal.length; y++) {
                    let dataCategory = dataDeal[y].category;
                    let voucher = dataDeal[y].voucher;
                    for (let z = 0; z < dataCategory.length; z++) {
                        let dataProduct = dataCategory[z].product
                        for (let x = 0; x < dataProduct.length; x++) {
                            let totalDeal = dataProduct[x].total_deal;
                            let countDeal = totalDeal - (totalDeal - 1)
                            let price = dataProduct[x].product_id.price;
                            var calculator = (50 - Number(voucher)) / Number(countDeal)
                            let priceDiscount = Number(price) - (Number(price) * (Number(voucher) + Number(calculator)) / 100)
                            dataProduct[x].lowest_price = priceDiscount.toFixed(0)
                        }
                    }
                }
            }
            res.send(Response(200, "Lấy dữ liệu thành công", { dataWeb: grouppedArray, dataAdmin: dataDeal }, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getDealBySlug: async (req, res) => {
        try {
            var dataDeal = await Deal.findOne({ isdelete: false, status: "0", slug: req.body.slug, $or: [{ type: "0" }, { type: "1" }] })
                .populate("category.product.product_id", `name image brand_id price slug total_deal info_product description description_brand how_to_use`)
                .populate("category.category_id")
                .lean()

            const dataBrand = await BrandModel.find({ isdelete: false })

            let dataResult = [];
            let dataCategory = ""
            let voucher = dataDeal.voucher
            for (let i = 0; i < dataDeal.category.length; i++) {
                let dataTemp = dataDeal.category[i].product;
                dataCategory = dataDeal.category[i].category_id;
                for (let y = 0; y < dataTemp.length; y++) {
                    var countOrder = await CountOrder.countDocuments({ slug: dataDeal.category[i].product[y].product_id.slug }).lean();
                    let data = dataDeal.category[i].product[y].product_id;
                    let totalDeal = dataDeal.category[i].product[y].total_deal;
                    if (countOrder == totalDeal) {
                        countOrder = Number(countOrder) - 1;
                    }
                    var calculator = (50 - Number(voucher)) / (Number(totalDeal) - Number(countOrder))
                    let price = Number(data.price) - (Number(data.price) * (Number(voucher) + Number(calculator)) / 100)
                    dataDeal.category[i].product[y].price_after_discount = Number(price.toFixed(0))
                }

                dataTemp.map(val => {
                    let data = dataBrand.filter(v => String(v._id) == String(val.product_id.brand_id));
                    val.product_id.brand_id = {
                        "_id": data[0]._id,
                        "name": data[0].name,
                        "image": data[0].image,
                        "link": data[0].link,
                    }

                    if (data.length > 0) {
                        console.log(val)
                        dataResult.push(Object.assign(val, {
                            category: {
                                "name": dataCategory.name,
                                "image": dataCategory.image,
                                "_id": dataCategory._id
                            }
                        }));
                    }
                })
            }

            res.send(Response(200, "Lấy dữ liệu thành công", {
                deal: {
                    name: dataDeal.name,
                    image: dataDeal.image,
                    slug: dataDeal.slug,
                    _id: dataDeal._id,
                    voucher: dataDeal.voucher
                }, product: dataResult
            }, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getProductOfDeal: async (req, res) => {
        try {
            var result = await Deal.find({ isdelete: false, type: "0" })
                .populate("category.product.product_id", `name image brand_id price slug total_deal info_product description description_brand how_to_use`)
                .lean()
            const arrProduct = [];
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    const dataCategory = result[i].category
                    const voucher = result[i].voucher
                    for (let y = 0; y < dataCategory.length; y++) {
                        const dataPro = dataCategory[y].product;
                        for (let x = 0; x < dataPro.length; x++) {
                            let objProduct = dataPro[x].product_id
                            const totalDeal = dataPro[x].total_deal
                            const countOrder = await CountOrder.countDocuments({ product_id: objProduct._id }).lean();
                            let calculator = (50 - Number(voucher)) / (Number(totalDeal) - Number(countOrder))
                            let price = Number(objProduct.price) - (Number(objProduct.price) * (Number(voucher) + Number(calculator)) / 100)

                            objProduct.voucher = voucher;
                            objProduct.price_after_discount = Math.round(price);
                            arrProduct.push(objProduct)
                        }
                    }
                }
                let dataResult = [];
                const dataBrand = await BrandModel.find({ isdelete: false });

                arrProduct.map(val => {
                    let data = dataBrand.filter(v => String(v._id) == String(val.brand_id));
                    dataResult.push(Object.assign(val, {
                        brand_id: {
                            "_id": data[0]._id,
                            "name": data[0].name,
                            "image": data[0].image,
                            "link": data[0].link,
                        }
                    }));
                })

                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataResult, true));
            } else {
                res.send(Response(200, "Lấy dữ liệu thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Đã có lỗi xảy ra !!!", err, false));
        }
    },

    addDeal: async (req, res) => {
        try {
            const { name, image, time_start, time_finish, type, status, voucher, category } = req.body;

            const result = await Deal.create({
                "category": category,
                "name": name,
                "image": image,
                "time_start": time_start,
                "time_finish": time_finish,
                "type": type,
                "status": status,
                "voucher": voucher,
            });

            if (result) {
                let repName = name.normalize("NFKD").replace(/[\u0300-\u036F]/g, "").split(' ').join('-');
                await Deal.updateMany({
                    "_id": ObjectId(result._id),
                }, {
                    slug: repName
                });
                res.send(Response(200, "Thêm sản phẩm thành công", result, true));
            } else {
                res.send(Response(202, result, [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateDeal: async (req, res) => {
        try {
            const { name, image, time_start, time_finish, type, status, voucher, id, category } = req.body;

            const objUpdate = {
                "name": name,
                "category": category,
                "image": image,
                "time_start": time_start,
                "time_finish": time_finish,
                "type": type,
                "status": status,
                "voucher": voucher,
            };

            let result = await Deal.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Success", [], true));
            } else {
                res.send(Response(202, "Fail", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteDeal: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await Deal.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Success", [], true));
        } else {
            res.send(Response(202, "Fail", [], false));
        }

    },

    addImage: async (req, res) => {
        const data = req.file
        res.send(Response(200, "Success", data, true));

    },
}