const ObjectId = require('mongodb').ObjectId
const PackageSaleLog = require('../models/PackageSaleLogModel')
const Response = require('../helpers/Response');

module.exports = {
    getListPackageSaleLog: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;
            if(condition == null){
                if (id == null) {
                    var result = await PackageSaleLog.find({ isDelete: false });
                } else {
                    var result = await PackageSaleLog.findOne({ _id: id, isDelete: false });
                }
            } else {
                var result = await PackageSaleLog.find(condition).limit(Number(limit));
            }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addPackageSaleLog: async (req, res) => {
        try {
            let body = req.body;
            const result = await PackageSaleLog.create({
                "Sale_Id": body.Sale_Id,
                "End_Date": body.End_Date,
                "Package_Id": body.Package_Id
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

    updatePackageSaleLog: async(req, res)=>{
        try{
            let body = req.body;
            const objUpdate = {
                "Sale_Id": body.Sale_Id,
                "End_Date": body.End_Date,
                "Status": body.Status,
                "Package_Id": body.Package_Id
            };

            let result = await PackageSaleLog.updateOne({_id: ObjectId(body.id)}, objUpdate);

            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        }catch(err){
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deletePackageSaleLog: async(req, res)=>{
        try{
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await PackageSaleLog.updateOne({_id: ObjectId(body.id)}, objDelete);

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