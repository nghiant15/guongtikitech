const ObjectId = require('mongodb').ObjectId
const Role = require('../models/RoleModel')
const Response = require('../helpers/Response');

module.exports = {
    getListRole: async (req, res) => {
        try {
            const { id } = req.query;
            let user = req.user;
            const { role } = req.body;
            var arrTemp = [];
            
            // if(condition == null){
            if (id == null) {
                // var arrTest = await Role.find({ isDelete: false });
                // var result_role = await Role.findOne({ _id: user.Role_Id, isDelete: false });
                // for(let i = 0; i < arrTest.length; i++){
                //     for(let y = 0; y < result_role.Array_Role.length; y++){
                //         if(result_role.Array_Role[y] == arrTest[i].Name){
                //             arrTemp.push(arrTest[i])
                //         }
                //     }
                // }
                // var result = arrTemp;
                var result = await Role.find({ isDelete: false });
            } else {
                var result = await Role.findOne({ _id: id, isDelete: false });
            }
            // } else {
            //     var result = await Role.find(condition).limit(Number(limit));
            // }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addRole: async (req, res) => {
        try {
            let body = req.body;
            const result = await Role.create({
                "Name": body.Name
            });
            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateRole: async (req, res) => {
        try {
            let body = req.body;
            const objUpdate = {
                "Name": body.Name,
                "Status": body.Status
            };

            let result = await Role.updateOne({ _id: ObjectId(body.id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteRole: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await Role.updateOne({ _id: ObjectId(body.id) }, objDelete);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }

    //
}