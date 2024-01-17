const ObjectId = require('mongodb').ObjectId
const Key = require('../models/KeyModel')
const HardWare = require('../models/HardWareModel')
const Response = require('../helpers/Response');

module.exports = {
    getListKey: async (req, res) => {
        try {
            const { limit } = req.query;
            const { condition } = req.body;
            var role = req.role;
            if (condition == null) {
                if(role == 'ADMIN' || role == 'ADMINSALE'){                   
                    var result = await Key.find({ isDelete: false });                  
                } else if(role == 'COMPANY' || role == 'SHOPMANAGER') {
                    var result = await Key.find({ isDelete: false, Company_Id: req.user.Company_Id});  
                }
            } else {
                var result = await Key.find(condition).limit(Number(limit));
            }
            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addKey: async (req, res) => {
        try {
            let body = req.body;
            const result = await Key.create({
                "Name": body.Name,
                "Company_Id": body.Company_Id,
                "Type_Key": body.Type_Key,
                "Start_Date": body.Start_Date,
                "End_Date": body.End_Date,
                "Value": body.Value
            });
            if (result) {
                await HardWare.updateOne({ Key: body.Value }, { Status: "AVAILABLE" });
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateKey: async (req, res) => {
        try {
            let body = req.body;
            const objUpdate = {
                "Status": body.Status
            };

            let result = await Key.updateOne({ _id: ObjectId(body.id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteKey: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await Key.updateOne({ _id: ObjectId(body.id) }, objDelete);

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