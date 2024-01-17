const ObjectId = require('mongodb').ObjectId
const CheckOrder = require('../models/Hardward/CheckOrderModel')
const ProductModel = require('../models/Hardward/ProductModel')
const UserModel = require('../models/UserModel')
const CustomerModel = require('../models/CustomerModel')
const Response = require('../helpers/Response');
const lodash = require('lodash');

module.exports = {
    getOrder: async (req, res) => {
        try {
            if (req.role == "ADMIN") {
                var result = await CheckOrder.find({ isDelete: false, type: "0" })
                    .populate("sale_id", `Name Company_Id`)
                    .populate("shop_id", `Name Company_Id`)
                    .lean()

                if (result) {
                    res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
                } else {
                    res.send(Response(202, "Lấy danh sách thất bại !!!", [], true));
                }
            } else if (req.role == "COMPANY") {
                var result = await CheckOrder.find({ isDelete: false, type: "0" })
                    .populate("sale_id", `Name Company_Id`)
                    .populate("shop_id", `Name Company_Id`)
                    .lean()

                const dataFilter = result.filter(data => data.shop_id.Company_Id == req.user.Company_Id);
                if (dataFilter) {
                    res.send(Response(200, "Lấy danh sách thành công !!!", dataFilter, true));
                } else {
                    res.send(Response(202, "Lấy danh sách thất bại !!!", [], true));
                }
            }



        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListAllOrder: async (req, res) => {
        try {
            var result = await CheckOrder.find({ isDelete: false, type: "0" })
                .populate("sale_id", `Name Company_Id`)
                .populate("shop_id", `Name Company_Id`)
                .lean()
            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    sumOrderByMonth: async (req, res) => {
        try {
            const { sale_id } = req.body;
            let dataSale = await UserModel.findOne({ _id: sale_id }, `Create_Date`).lean()
            let month = new Date(dataSale.Create_Date).getMonth() + 1;
            let currentMonth = new Date(Date.now()).getMonth() + 1;
            const arrTemp = [];
            for (let i = month; i <= currentMonth; i++) {
                let totalPrice = 0;
                let result = await CheckOrder.find({
                    "time": {
                        "$gte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-01T03:00:00.926Z`,
                        "$lte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-31T03:00:00.926Z`
                    },
                    "sale_id": sale_id,
                    "type": "0"
                }).lean();

                for (let i = 0; i < result.length; i++) {
                    totalPrice += result[i].total
                }

                arrTemp.push({ month: i, total: totalPrice, list_order: result })

            }


            if (arrTemp) {
                res.send(Response(200, "Thống kê đơn hàng theo tháng thành công !!!", arrTemp, true));
            } else {
                res.send(Response(202, "Thống kê đơn hàng theo tháng thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    sumProductByMonth: async (req, res) => {
        try {
            const { sale_id } = req.body;
            let dataSale = await UserModel.findOne({ _id: sale_id }, `Create_Date`).lean()

            let month = new Date(dataSale.Create_Date).getMonth() + 1;
            // let currentMonth = new Date(Date.now()).getMonth() + 1;
            let currentMonth = 12;
            
            console.log(currentMonth);
            const arrTemp = [];
            for (let i = month; i <= currentMonth; i++) {

                let totalPrice = 0;
                let result = await CheckOrder.find({
                    "time": {
                        "$gte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-01T03:00:00.926Z`,
                        "$lte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-31T03:00:00.926Z`
                    },
                    "sale_id": sale_id,
                    "type": "1"
                }).lean();

                for (let i = 0; i < result.length; i++) {
                    totalPrice += result[i].total
                }

                arrTemp.push({ month: i, total: totalPrice, list_order: result })
            }

            for (let i = 1; i <= 1; i++) {

                let totalPrice = 0;
                let result = await CheckOrder.find({
                    "time": {
                        "$gte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-01T03:00:00.926Z`,
                        "$lte": `${new Date().getFullYear()}-${String(i).length > 1 ? i : "0" + i}-31T03:00:00.926Z`
                    },
                    "sale_id": sale_id,
                    "type": "1"
                }).lean();

                for (let i = 0; i < result.length; i++) {
                    totalPrice += result[i].total
                }

                arrTemp.push({ month: i, total: totalPrice, list_order: result })
            }


            
            if (arrTemp) {
                res.send(Response(200, "Thống kê sản phẩm theo tháng thành công !!!", arrTemp, true));
            } else {
                res.send(Response(202, "Thống kê sản phẩm theo tháng thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    sumProductByDay: async (req, res) => {
        try {
            const { sale_id, day, month } = req.body;
            if (day == "" || day == null || day == undefined) {
                res.send(Response(202, "Chưa nhập ngày hoặc định dạng ngày sai !!!", [], true));
            } else {
                let dataSale = await UserModel.findOne({ _id: sale_id }, `Create_Date`).lean()
                let monthSaleWork= new Date(dataSale.Create_Date).getMonth() + 1;
                let dayCurrent = Number(day)
                if(month > monthSaleWork) {
                    let result = await CheckOrder.find({
                        "time": {
                            "$lte": `${new Date().getFullYear()}-${String(month).length > 1 ? month : "0" + month}-${String(dayCurrent).length > 1 ? dayCurrent : "0" + dayCurrent}T03:00:00.926Z`
                        },
                        "sale_id": sale_id,
                        "type": "1"
                    }).lean();

                    if (result) {
                        res.send(Response(200, "Thống kê sản phẩm theo ngày thành công !!!", result, true));
                    } else {
                        res.send(Response(202, "Thống kê sản phẩm theo ngày thất bại !!!", [], false));
                    }
                } else {
                    res.send(Response(202, "Tháng truyền vào bé hơn thàng Sale vào làm !!! Không thể thống kê !!!", [], false));
                }
            }

        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getOrderSaleByMonth: async (req, res) => {
        try {
            const { month, sale_id } = req.body;

            let result = await CheckOrder.find({
                "time": {
                    "$gte": `${new Date().getFullYear()}-${month.length > 1 ? month : "0" + month}-01T03:00:00.926Z`,
                    "$lte": `${new Date().getFullYear()}-${month.length > 1 ? month : "0" + month}-31T03:00:00.926Z`
                },
                "sale_id": sale_id,
                "type": "1"
            }).lean();

            const products = await ProductModel.find({
                isDelete: false
            }, `image name sku_code`)

            let resultProduct = [];

            result.map((val) => {
                const dataproduct = products.filter((v) => String(v["sku_code"]) == String(val.scan_code));
                if (dataproduct.length > 0) {
                    resultProduct.push(Object.assign(val, { product_data: { name: dataproduct[0].name, image: "https://admin-api.tikitech.vn/public/image_product/" + dataproduct[0].image } }));
                } else {
                    resultProduct.push(Object.assign(val, { product_data: { name: null, image: null } }));
                }
            });

            if (result) {
                res.send(Response(200, "Thống kê sản phẩm theo tháng thành công !!!", resultProduct, true));
            } else {
                res.send(Response(202, "Thống kê sản phẩm theo tháng thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getCustomerSaleByMonth: async (req, res) => {
        try {
            const { month, sale_id } = req.body;

            let result = await CustomerModel.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-${month.length > 1 ? month : "0" + month}-01T03:00:00.926Z`,
                    "$lte": `${new Date().getFullYear()}-${month.length > 1 ? month : "0" + month}-31T03:00:00.926Z`
                },
                "Sale_Id": sale_id,
                "isDelete": false
            }).lean();

            const counts = {};

            result.forEach(function (x) { counts[x.Phone] = (counts[x.Phone] || 0) + 1; });
            console.log(counts)

            const arrTemp = [];

            for (let i = 0; i < result.length; i++) {
                if (!arrTemp.find((x) => x.Phone == result[i].Phone)) {
                    result[i].time_appear = counts[`${result[i].Phone}`]
                    arrTemp.push(result[i])
                }

            }

            if (result) {
                res.send(Response(200, "Thống kê khách hàng theo tháng thành công !!!", arrTemp, true));
            } else {
                res.send(Response(202, "Thống kê khách hàng theo tháng thất bại !!!", [], true));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getOrderProduct: async (req, res) => {
        try {
            if (req.role == "ADMIN") {
                var result = await CheckOrder.find({ isDelete: false, type: "1" })
                    .populate("sale_id", `Name Company_Id`)
                    .populate("shop_id", `Name Company_Id`)
                    .lean()

                var dataCustomer = await CustomerModel.find({ isDelete: false }).lean()

                let data = [];
                result.map((val) => {
                    const customer = dataCustomer.filter((v) => String(v["Phone"]) == String(val["customer_phone"]));

                    data.push(
                        Object.assign(val, {
                            name_customer: customer[0] == undefined ? "" : customer[0].Name,
                        })
                    );
                });

                if (result) {
                    res.send(Response(200, "Lấy danh sách thành công !!!", data, true));
                } else {
                    res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
                }
            } else if (req.role == "COMPANY") {

                var result = await CheckOrder.find({ isDelete: false, type: "1" })
                    .populate("sale_id", `Name Company_Id`)
                    .populate("shop_id", `Name Company_Id`)
                    .lean()
                const dataFilter = result.filter(data => data.shop_id.Company_Id == req.user.Company_Id);

                var dataCustomer = await CustomerModel.find({ isDelete: false }).lean()

                let data = [];
                dataFilter.map((val) => {
                    const customer = dataCustomer.filter((v) => String(v["Phone"]) == String(val["customer_phone"]));

                    data.push(
                        Object.assign(val, {
                            name_customer: customer[0] == undefined ? "" : customer[0].Name,
                        })
                    );
                });

                if (dataFilter) {
                    res.send(Response(200, "Lấy danh sách thành công !!!", data, true));
                } else {
                    res.send(Response(202, "Lấy danh sách thất bại !!!", [], true));
                }
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    checkExitsCustomerByPhone: async (req, res) => {
        try {
            var count = await CustomerModel.countDocuments({ isDelete: false, Phone: req.body.phone }).lean()
            var data = await CustomerModel.findOne({ isDelete: false, Phone: req.body.phone }).lean()

            if (count > 0) {
                res.send(Response(200, "Khách hàng có tồn tại trong hệ thống !!!", data, true));
            } else {
                res.send(Response(202, "Khách hàng chưa tồn tại trong hệ thống !!!", 0, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addOrder: async (req, res) => {
        try {
            const { data_order } = req.body;
            const arrTemp = [];
            for (let i = 0; i < data_order.length; i++) {
                arrTemp.push({
                    "sale_id": data_order[i].sale_id,
                    "shop_id": "6163e5e929c3576f630762b5"/*data_order[i].shop_id*/,
                    "code_order": data_order[i].code_order,
                    "time": data_order[i].time,
                    "total": data_order[i].total,
                    "type": "0"
                })
            }
            const result = await CheckOrder.insertMany(arrTemp);
            if (result) {
                res.send(Response(200, "Thêm dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Thêm dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { id, total } = req.body;

            const result = await CheckOrder.updateOne({ _id: ObjectId(id) }, { "total": total });

            if (result) {
                res.send(Response(200, "Cập nhật dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Cập nhật dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    },

    addOrderProduct: async (req, res) => {
        try {
            const { sale_id, shop_id, scan_code, time, total, quantity, customer_phone } = req.body;

            const result = await CheckOrder.create({
                "sale_id": sale_id,
                "shop_id": "6163e5e929c3576f630762b5"/*shop_id*/,
                "scan_code": scan_code,
                "quantity": quantity,
                "customer_phone": customer_phone,
                "time": time,
                "total": total,
                "type": "1"
            });
            if (result) {
                res.send(Response(200, "Thêm dữ liệu thành công !!!", result, true));
            } else {
                res.send(Response(202, "Thêm dữ liệu thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, err, err, false));
        }
    }
}