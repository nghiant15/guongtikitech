const ObjectId = require('mongodb').ObjectId
const User = require('../../models/Hardward/EndUser')
const Response = require('../../helpers/Response');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

module.exports = {
    //User Table
    getListUser: async (req, res) => {
        try {
            var dataUser = await User.find({ isdelete: false, type: "1" }).lean()
             
            res.send(Response(200, "Success", dataUser, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListUserById: async (req, res) => {
        try {
            var dataUser = await User.findOne({ isdelete: false, type: "1", _id: req.user._id }).lean()
             
            res.send(Response(200, "Success", dataUser, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    LoginAdmin: async (req, res) => {
        try {
            const { username, password } = req.body;
            var dataUser = await User.findOne()
            .or([{ username: username, password: password, type: "0" }, 
                { email: username, password: password, type: "0" }]);
            if (dataUser != null) {
                const token = jwt.sign({ _id: dataUser._id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
                res.send(Response(200, "Login Success !!!", { "data": dataUser, "token": token }, true));
            } else {
                res.send(Response(202, "Login Fail !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }

    },

    LoginUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            var dataUser = await User.findOne()
            .or([{ username: username, password: md5(password), type: "1" }, 
                { email: username, password: md5(password), type: "1" }]);
            if (dataUser != null) {
                const token = jwt.sign({ _id: dataUser._id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
                res.send(Response(200, "Login Success !!!", { "data": dataUser, "token": token }, true));
            } else {
                res.send(Response(202, "Login Fail !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }

    },

    generateAuthToken: async (req, res) => {
        var user = this;
        const token = jwt.sign({ _id: user._id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
        return token;
    },

    addUser: async (req, res) => {
        try {
            const { name, email, phone, address, username, password, avatar } = req.body;

            const count = await User.countDocuments({
                "username": username
            });
            if(count < 1) {
                const result = await User.create({
                    "name": name,
                    "avatar": avatar,
                    "email": email,
                    "phone": phone,
                    "address": address,
                    "username": username,
                    "password": md5(password),
                    "type": "1",
                });
                if (result) {
                    res.send(Response(200, "Thêm người dùng thành công", result, true));
                } else {
                    res.send(Response(202, result, [], false));
                }
            } else {
                res.send(Response(202, "Thêm người dùng không thành công !!! username đã tồn tại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateUser: async (req, res) => {
        try {
            const { name, email, phone, address, id } = req.body;
            
            const objUpdate = {
                "name": name,
                "email": email,
                "phone": phone,
                "address": address,
            };

            let result = await User.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Success", [], true));
            } else {
                res.send(Response(202, "Fail", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateUserByID: async (req, res) => {
        try {
            const { name, email, phone, address } = req.body;
            
            const objUpdate = {
                "name": name,
                "email": email,
                "phone": phone,
                "address": address,
            };

            let result = await User.updateOne({ _id: ObjectId(req.user._id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Success", [], true));
            } else {
                res.send(Response(202, "Fail", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { old_password, new_password } = req.body;

            let dataUser = await User.findOne({ _id: ObjectId(req.user._id) });
            if(md5(old_password) == dataUser.password) {
                const objUpdate = {
                    "password": md5(new_password),
                };

                if(md5(old_password) == md5(new_password)) {
                    let result = await User.updateOne({ _id: ObjectId(req.user._id) }, objUpdate);

                    if (result) {
                        res.send(Response(200, "Reset mật khẩu thành công !!!", [], true));
                    } else {
                        res.send(Response(202, "Reset mật khẩu thất bại !!!", [], false));
                    }
                } else {
                    res.send(Response(202, "Mật khẩu cũ và mới không trùng nhau !!!", [], false));
                }
            } else {
                res.send(Response(202, "Mật khẩu cũ và mới không trùng nhau !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteUser: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await User.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Success", [], true));
        } else {
            res.send(Response(202, "Fail", [], false));
        }

    },

    addImage: async (req, res) => {
        console.log(req.file)
        res.send("Ok")

    },
}