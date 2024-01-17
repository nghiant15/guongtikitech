const ObjectId = require('mongodb').ObjectId
const TypeKey = require('../models/TypeKeyModel')
const Response = require('../helpers/Response');
module.exports = {
    getListTypeKey: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;
            if(condition == null){
                if (id == null) {
                    var result = await TypeKey.find({ isDelete: false });
                } else {
                    var result = await TypeKey.findOne({ _id: id, isDelete: false });
                }
            } else {
                var result = await TypeKey.find(condition).limit(Number(limit));
            }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addTypeKey: async (req, res) => {
        try {
            let body = req.body;
            const result = await TypeKey.create({
                "Name": body.Name
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

    updateTypeKey: async(req, res)=>{
        try{
            let body = req.body;
            const objUpdate = {
                "Name": body.Name,
                "Status": body.Status
            };

            let result = await TypeKey.updateOne({_id: ObjectId(body.id)}, objUpdate);

            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        }catch(err){
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteTypeKey: async(req, res)=>{
        try{
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await TypeKey.updateOne({_id: ObjectId(body.id)}, objDelete);

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