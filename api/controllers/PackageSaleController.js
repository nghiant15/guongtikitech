const ObjectId = require('mongodb').ObjectId
const PackageSale = require('../models/PackageSaleModel')
const Response = require('../helpers/Response');

module.exports = {
    getListPackageSale: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;
            if(condition == null){
                if (id == null) {
                    var result = await PackageSale.find({ isDelete: false });
                } else {
                    var result = await PackageSale.findOne({ _id: id, isDelete: false });
                }
            } else {
                var result = await PackageSale.find(condition).limit(Number(limit));
            }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addPackageSale: async (req, res) => {
        try {
            let body = req.body;
            const result = await PackageSale.create({
                "Name": body.Name,
                "Company_Id": body.Company_Id,
                "End_Date": body.End_Date
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

    updatePackageSale: async(req, res)=>{
        try{
            let body = req.body;
            const objUpdate = {
                "Name": body.Name,
                "Company_Id": body.Company_Id,
                "End_Date": body.End_Date,
                "Status": body.Status,
            };

            let result = await PackageSale.updateOne({_id: ObjectId(body.id)}, objUpdate);

            if(result){
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        }catch(err){
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deletePackageSale: async(req, res)=>{
        try{
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await PackageSale.updateOne({_id: ObjectId(body.id)}, objDelete);

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