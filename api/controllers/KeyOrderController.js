const ObjectId = require('mongodb').ObjectId
const KeyOrder = require('../models/KeyOrderModel')
const Response = require('../helpers/Response');

module.exports = {
    getListKeyOrder: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;
            if(condition == null){
                if (id == null) {
                    var result = await KeyOrder.find({ isDelete: false });
                } else {
                    var result = await KeyOrder.findOne({ _id: id, isDelete: false });
                }
            } else {
                var result = await KeyOrder.find(condition).limit(Number(limit));
            }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addKeyOrder: async (req, res) => {
        try {
            let body = req.body;
            const result = await KeyOrder.create({
                "UserName": body.UserName,
                "Email": body.Email,
                "Company_Id":body.Company_Id,
                "Address": body.Address,
                "Phone": body.Phone,
                "Status": body.Status
            });
            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateKeyOrder: async(req, res)=>{
        try{
            let body = req.body;
            const objUpdate = {
                "UserName": body.UserName,
                "Email": body.Email,
                "Company_Id": body.Company_Id,
                "Address": body.Address,
                "Phone": body.Phone,
                "Status": body.Status
            };

            let result = await KeyOrder.updateOne({_id: ObjectId(body.id)}, objUpdate);

            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        }catch(err){
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteKeyOrder: async(req, res)=>{
        try{
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await KeyOrder.updateOne({_id: ObjectId(body.id)}, objDelete);

            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        }catch(err){
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }

    //
}