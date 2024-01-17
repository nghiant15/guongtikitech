const ObjectId = require('mongodb').ObjectId
const NotificationModel = require('../../models/Hardward/NotificationModel')
const Response = require('../../helpers/Response');


module.exports = {
    listNotification: async (req, res) => {
        try {
            var result = await NotificationModel.find({
                isDelete: false, user_id: req.user._id
            })
            if (result) {
                res.send(Response(200, "Lấy danh sách thành công !!!", result, true));
            } else {
                res.send(Response(202, "Lấy danh sách thất bại !!!", result, true));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addNotification: async (req, res) => {
        try {
            const { } = req.body;
            const role = req.role;
            const result = await NotificationModel.create({

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

    updateNotification: async (req, res) => {
        try {
            const { } = req.body;

            const result = await NotificationModel.updateOne({ _id: ObjectId(id) }, {

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

    deleteNotification: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await NotificationModel.updateOne({ _id: ObjectId(body.id) }, objDelete);

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