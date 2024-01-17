const ObjectId = require('mongodb').ObjectId
const OrderAddress = require('../../models/Hardward/OrderAddressModel')
const Response = require('../../helpers/Response');
const lodash = require('lodash');

module.exports = {
    //OrderAddress Table
    getListOrderAddress: async (req, res) => {
        try {
            var dataOrderAddress = await OrderAddress.find({ isdelete: false, user_id: String(req.user._id) })
                .populate("user_id", `name image username email phone`)
                .lean()

            res.send(Response(200, "Lấy dữ liệu thành công", dataOrderAddress, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListOrderAddressById: async (req, res) => {
        try {
            var dataOrderAddress = await OrderAddress.findOne({ isdelete: false, _id: req.body.id })
                .populate("user_id", `name image username email phone`)
                .lean()

            res.send(Response(200, "Lấy dữ liệu thành công", dataOrderAddress, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addOrderAddress: async (req, res) => {
        try {
            const { name, surname, address, city, distrist, ward, phone } = req.body;

            const result = await OrderAddress.create({
                "name": name,
                "surname": surname,
                "address": address,
                "city": city,
                "distrist": distrist,
                "ward": ward,
                "phone": phone,
                "user_id": req.user._id,
            });

            if (result) {
                res.send(Response(200, "Thêm địa chỉ giao hàng thành công", result, true));
            } else {
                res.send(Response(202, result, [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateOrderAddress: async (req, res) => {
        try {
            const { name, surname, address, city, distrist, ward, phone } = req.body;

            const objUpdate = {
                "name": name,
                "surname": surname,
                "address": address,
                "city": city,
                "distrist": distrist,
                "ward": ward,
                "phone": phone,
            };

            let result = await OrderAddress.updateOne({ _id: req.body.id }, objUpdate);

            if (result) {
                res.send(Response(200, "Success", [], true));
            } else {
                res.send(Response(202, "Fail", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateDefaultOrderAddress: async (req, res) => {
        try {
            const { id } = req.body;

            const objUpdate = {
                "isSelect": "1"
            };

            await OrderAddress.updateMany({ user_id: req.user._id }, { $set: { isSelect: "0" } });

            let result = await OrderAddress.updateOne({ _id: id }, objUpdate);

            if (result) {
                res.send(Response(200, "Đặt địa chỉ mặc định thành công !!!", [], true));
            } else {
                res.send(Response(202, "Đặt địa chỉ mặc định thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getDefaultOrderAddress: async (req, res) => {
        try {
            let count = await OrderAddress.countDocuments({ isdelete: false, user_id: req.user._id, isSelect: "1" }).lean()

            if(count > 0) {
                let dataOrderAddress = await OrderAddress.findOne({ isdelete: false, user_id: req.user._id, isSelect: "1" })
                .populate("user_id", `name image username email phone`)
                .lean()
                res.send(Response(200, "Lấy dữ liệu thành công", dataOrderAddress, true));
            } else {
                let dataOrderAddress = await OrderAddress.find({ isdelete: false, user_id: req.user._id })
                .populate("user_id", `name image username email phone`)
                .lean()

                let dataReverse = lodash.reverse(dataOrderAddress)
                res.send(Response(200, "Lấy dữ liệu thành công", dataReverse[0], true));
            }
            

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteOrderAddress: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await OrderAddress.updateOne({ _id: ObjectId(body.id) }, objDelete);

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