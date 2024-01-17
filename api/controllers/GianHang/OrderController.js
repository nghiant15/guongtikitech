const ObjectId = require('mongodb').ObjectId
const Order = require('../../models/Hardward/OrderModel')
const OrderDetail = require('../../models/Hardward/OrderDetailModel')
const OrderAddress = require('../../models/Hardward/OrderAddressModel')
const CountOrder = require('../../models/Hardward/CountOrderModel')
const Product = require('../../models/Hardward/ProductModel')
const CategoryModel = require('../../models/Hardward/CategoryModel')
const BrandModel = require('../../models/Hardward/BrandModel')
const Transport = require('../../models/Hardward/TransportModel')
const Response = require('../../helpers/Response');
const fs = require('fs');
const API_CONNECT = require('../../helpers/callAPI');

async function callAPI_GHTK(arrTransport, order_id, dataAddress, count, delivery, username) {
    var addTransport = await API_CONNECT(
        "/services/shipment/order/?ver=1.5",
        {
            "products": arrTransport,
            "order": {
                "id": order_id,
                "pick_name": "Tikitech",
                "pick_address": "785/12 Nguyễn Kiệm",
                "pick_province": "Thành phố Hồ Chí Minh",
                "pick_district": "Quận Gò Vấp",
                "pick_ward": "Phường 3",
                "pick_tel": "0903969952",
                "tel": "0329646467",
                "name": username,
                "address": String(dataAddress.address),
                "province": String(dataAddress.city),
                "district": String(dataAddress.distrist),
                "ward": String(dataAddress.ward),
                "hamlet": "Khác",
                "is_freeship": "1",
                "pick_date": new Date(Date.now()).toLocaleDateString(),
                "pick_money": 0,
                "note": "Khối lượng tính cước tối đa: 1.00 kg",
                "value": Number(count),
                // "transport": "fly",
                "pick_option": "cod",
                "deliver_option": delivery == null || delivery == "" ? "none" : "xteam",
                "pick_session": 2
            }
        }, "POST")

    return addTransport;
}

module.exports = {
    //Order Table
    getListOrder: async (req, res) => {
        try {
            var dataOrder = await Order.find({ isdelete: false })
                .sort({_id:-1})
                .populate({ path: 'transport_id' })
                .populate({ path: 'user_id' }).lean()

            res.send(Response(200, "Lấy dữ liệu thành công", dataOrder, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    ManagerOrder: async (req, res) => {
        try {
            var dataOrder = await Order.find({ isdelete: false, user_id: req.user._id })
                .populate("detail_id", `list_product`)
                .populate("order_address_id")
                .populate("transport_id", `status status_tkn res_order`)
                .lean()

            const dataProduct = await Product.find({ isdelete: false }).lean()

            if (dataOrder) {
                let orderDateReturn = [];
                dataOrder.map(val => {
                    orderDateReturn.push(Object.assign(val));
                })

                for (let i = 0; i < orderDateReturn.length; i++) {
                    orderDateReturn[i].detail_id.list_product.map(val => {
                        let data = dataProduct.filter(v => String(v._id) == String(val.product_id));
                        if (data.length > 0) {
                            val.product_id = data[0]
                        }
                    })
                }

                res.send(Response(200, "Lấy dữ liệu thành công !!!", orderDateReturn, true));
            } else {
                res.send(Response(200, "Lấy dữ liệu thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    ManagerOrderByID: async (req, res) => {
        try {
            var dataOrder = await Order.find({ isdelete: false, user_id: req.user._id, _id: req.body.id })
                .populate("detail_id", `list_product`)
                .populate("order_address_id")
                .populate("transport_id", `status status_tkn res_order`)
                .lean()

            const dataProduct = await Product.find({ isdelete: false }).lean()

            if (dataOrder) {
                let orderDateReturn = [];

                dataOrder.map(val => {
                    val.cost = val.total + val.transport_cost
                    orderDateReturn.push(Object.assign(val, { cost: val.total + val.transport_cost }));
                })

                for (let i = 0; i < orderDateReturn.length; i++) {
                    orderDateReturn[i].detail_id.list_product.map(val => {
                        let data = dataProduct.filter(v => String(v._id) == String(val.product_id));
                        if (data.length > 0) {
                            val.product_id = data[0]
                        }
                    })
                }

                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataOrder, true));
            } else {
                res.send(Response(200, "Lấy dữ liệu thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListDetail: async (req, res) => {
        try {
            const { id } = req.body;
            const dataBrand = await BrandModel.find().lean();
            const dataCategory = await CategoryModel.find().lean();
            const arrResult = [];
            let dataOrder = await OrderDetail.findOne({ isdelete: false, _id: ObjectId(id) })
                .sort({ _id: -1 })
                .populate('list_product.product_id')
                .populate('order_id', `payment_method transport_method status status_tkn transport_id`)
                .lean()

            let arrProduct = dataOrder.list_product;
            
            arrProduct.map(val => {
                let brand = dataBrand.filter(v => String(v._id) == String(val.product_id.brand_id));
                let category = dataCategory.filter(v => String(v._id) == String(val.product_id.category_id));
                arrResult.push(Object.assign(val.product_id, {
                    brand_id: {
                        "_id": brand[0]._id,
                        "name": brand[0].name,
                        "image": brand[0].image
                    },
                    category_id: {
                        "_id": category[0]._id,
                        "name": category[0].name,
                        "image": category[0].image
                    }
                }));
            })
            console.log(dataOrder)
            res.send(Response(200, "Lấy dữ liệu thành công", dataOrder, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getTransportData: async (req, res) => {
        try {
            const { id } = req.query;
            let dataTransport = await Transport.findOne({ isdelete: false, _id: ObjectId(id) }).lean()

            if(dataTransport) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataTransport, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", {}, false));
            }

        } catch (err) {
            res.send(Response(202, "Đã có lỗi xảy ra !!!", err, false));
        }
    },

    getListOrderByUser: async (req, res) => {
        try {
            
            let dataOrder = await Order.find({ isdelete: false, user_id: ObjectId(req.user._id) }).lean()

            if(dataOrder) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", dataOrder, true));
            } else {
                res.send(Response(200, "Lấy dữ liệu thất bại !!!", [], false));
            }
            

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addOrder: async (req, res) => {
        try {
            const { list_product, order_address_id, delivery, transport_cost,
                payment_method, transport_method } = req.body;
            const arrProduct = [];
            const arrProduct_ID = [];
            const arrTransport = [];
            const arrQuantity = []
            var count = 0;

            if (list_product.length > 0) {
                for (let i = 0; i < list_product.length; i++) {
                    arrProduct.push(list_product[i].product_id)
                    arrQuantity.push(list_product[i].quantity == null || list_product[i].quantity == "" || list_product[i].quantity == undefined ? 1 : list_product[i].quantity)
                }

                const dataPro = await Product.find({
                    _id: { $in: arrProduct },
                });
                const result = await Order.create({
                    "user_id": req.user._id,
                    "order_address_id": order_address_id,
                    "transport_cost": transport_cost,
                    //"cost": Number(cost),
                    "payment_method": payment_method,
                    "transport_method": transport_method,
                    "delivery": delivery
                });

                for (let i = 0; i < dataPro.length; i++) {
                    arrProduct_ID.push({
                        product_id: dataPro[i]._id,
                        slug: dataPro[i].slug,
                        order_id: result._id
                    })

                    arrTransport.push({
                        "name": dataPro[i].name,
                        "weight": Number(dataPro[i].weight / 1000),
                        "quantity": Number(arrQuantity[i]),
                        "product_code": dataPro[i]._id
                    })

                    count = count + (dataPro[i].price * Number(arrQuantity[i]))
                }

                const resDetail = await OrderDetail.create({
                    order_id: result._id,
                    list_product: list_product
                });


                if (resDetail) {
                    await Order.updateMany({
                        "_id": result._id
                    }, {
                        $set: {
                            "detail_id": resDetail._id,
                            "total": count
                        }
                    });

                }

                if (payment_method == "1") {
                    if (transport_method == "0") {
                        const dataAddress = await OrderAddress.findOne({
                            _id: order_address_id,
                        });
                        if(dataAddress == "null" || dataAddress == null) {
                            res.send(Response(202, "Thông tin địa chỉ bị trống !!!", [], false));
                        } else {
                            var addTransport = await callAPI_GHTK(arrTransport, result._id, dataAddress, count, delivery, req.user.Name)

                            if (addTransport.success == true) {
                                await CountOrder.insertMany(arrProduct_ID);
    
                                const resTransport = await Transport.create({
                                    code_transport: transport_method,
                                    code_payment: payment_method,
                                    res_order: addTransport.order,
                                    order_id: result._id,
                                    status: "0",
                                    status_tkn: "00",
                                    vnpaystatus: "00"
                                });
    
                                await Order.updateOne({
                                    "_id": result._id
                                }, {
                                    "transport_id": resTransport._id,
                                    "status": "1",
                                    "status_tkn": "00",
                                    "vnpaystatus": "00"
                                });
                            } else {
                                await Order.deleteOne({ _id: result._id });
                                res.send(Response(202, addTransport.message, [], false));
                            }
                        }


                    }

                    res.send(Response(200, "Thêm đơn hàng mới thành công !!!", {
                        order_id: result._id,
                        result: addTransport.order
                    }, true));
                } else {
                    res.send(Response(200, "Thêm đơn hàng mới thành công !!!", {
                        order_id: result._id
                    }, true));
                }
            } else {
                res.send(Response(202, "Đơn hàng chưa có sản phẩm !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Có lỗi xảy ra !!!", JSON.stringify(err), false));
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { order_id, status, vnpaystatus } = req.body;
            const arrProduct = [];
            const arrTransport = [];
            const arrQuantity = [];

            if (status == "1" && vnpaystatus == "00") {

                const dataOrder = await Order.findOne({
                    _id: order_id,
                })
                    .populate("transport_id", `res_order`)
                    .populate("order_address_id", `_id`)
                    .populate("detail_id").lean()

                const dataAddress = await OrderAddress.findOne({
                    _id: dataOrder.order_address_id,
                });

                const products = dataOrder.detail_id.list_product;

                for (let i = 0; i < products.length; i++) {
                    arrProduct.push(products[i].product_id)
                    arrQuantity.push(products[i].quantity == null || products[i].quantity == "" || products[i].quantity == undefined ? 1 : products[i].quantity)
                }

                const dataPro = await Product.find({
                    _id: { $in: arrProduct },
                });

                for (let i = 0; i < dataPro.length; i++) {
                    arrTransport.push({
                        "name": dataPro[i].name,
                        "weight": Number(dataPro[i].weight),
                        "quantity": Number(arrQuantity[i]),
                        "product_code": dataPro[i]._id
                    })
                }

                const objUpdate = {
                    "status": "1"
                };

                let result = await Order.updateOne({ _id: ObjectId(order_id) }, objUpdate);

                if (result) {
                    var addTransport = await callAPI_GHTK(arrTransport, order_id, dataAddress, dataOrder.total, dataOrder.delivery, req.user.Name)

                    const resTransport = await Transport.create({
                        code_transport: "0",
                        code_payment: "0",
                        res_order: addTransport.order,
                        order_id: order_id,
                        status: "1",
                        status_tkn: "00"
                    });

                    if (resTransport) {
                        await Order.updateOne({
                            "_id": order_id
                        }, {
                            "transport_id": resTransport._id,
                            "status": status,
                            "status_tkn": vnpaystatus
                        });

                        res.send(Response(200, "Cập nhật đơn hàng thành công !!!", dataOrder, true));
                    }

                } else {
                    res.send(Response(202, "Cập nhật đơn hàng thất bại !!!", [], false));
                }
            } else {
                res.send(Response(202, "Cập nhật đơn hàng thất bại !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getInfoOrder: async (req, res) => {
        try {
            const { id } = req.query;

            let result = await Order.findOne({ _id: ObjectId(id) }).lean();

            if (result) {
                res.send(Response(200, "Lấy dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { detail_id, total, order_address_id, id } = req.body;

            const objUpdate = {
                "user_id": req.user._id,
                "detail_id": detail_id,
                "total": total,
                "order_address_id": order_address_id
            };

            let result = await Order.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Cập nhật đơn hàng thành công !!!", [], true));
            } else {
                res.send(Response(202, "Cập nhật đơn hàng thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },


    printOrder: async (req, res) => {
        const { label } = req.query;
        var printOrder = await API_CONNECT("/services/label/" + label, {}, "POST")
        if (printOrder) {
            fs.writeFileSync('public/pdf/test.pdf', printOrder);
            res.send(Response(200, "In đơn hàng thành công !!!", printOrder, true));
        } else {
            res.send(Response(202, "In đơn hàng thất bại !!!", [], false));
        }
    },

    deleteOrder: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await Order.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Xoá đơn hàng thành công !!!", [], true));
        } else {
            res.send(Response(202, "Xoá đơn hàng thất bại !!!", [], false));
        }

    },
}