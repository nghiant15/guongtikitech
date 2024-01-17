const ObjectId = require('mongodb').ObjectId
const HardWare = require('../models/HardWareModel')
const Key = require('../models/KeyModel')
const Response = require('../helpers/Response');

module.exports = {
    getListHardWare: async (req, res) => {
        try {
            const { id, limit } = req.query;
            const { condition } = req.body;
            var arrTemp = [];
            if (condition == null) {
                if (id == null) {
                    var result = await HardWare.find()
                    //.or([{ isDelete: false, Status: 'INSTOCK' }, { isDelete: false, Status: 'AVAILABLE' }]);
                } else {
                    var result = await HardWare.find({ _id: id, isDelete: false });
                }
            } else {
                var result = await HardWare.find(condition).limit(Number(limit));
            }

            var resultKey = await Key.find({ isDelete: false, Status: 'DISABLE' });
            if (resultKey.length == 0) {
                res.send(Response(200, "Thành công", result, true));
            } else {
                for (let i = 0; i < result.length; i++) {
                    for (let y = 0; y < resultKey.length; y++) {
                        if (result[i].Key == resultKey[y].Value) {
                            result.splice(i, 1);
                        }
                    }
                }

                res.send(Response(200, "Thành công", result, true));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addHardWare: async (req, res) => {
        try {
            const { Name, Active_Date, End_Date, HardWare_Name, Call_Name, Serial_Number, UniqueID } = req.body;
            const result = await HardWare.create({
                "Name": Name,
                "HardWare_Name": HardWare_Name,
                "Call_Name": Call_Name,
                "Serial_Number": Serial_Number,
                "UniqueID": UniqueID,
                "Active_Date": Active_Date,
                "End_Date": End_Date
            });
            if (result) {
                await Key.create({
                    "Name": result.Name,
                    "Value": result.Key
                });
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateHardWare: async (req, res) => {
        try {
            const { Name, Active_Date, End_Date, HardWare_Name, Call_Name, Serial_Number, UniqueID, Status, id } = req.body;
            const objUpdate = {
                "Name": Name,
                "HardWare_Name": HardWare_Name,
                "Call_Name": Call_Name,
                "Serial_Number": Serial_Number,
                "UniqueID": UniqueID,
                "Active_Date": Active_Date,
                "End_Date": End_Date,
                "Status": Status
            };

            let result = await HardWare.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteHardWare: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await HardWare.updateOne({ _id: ObjectId(body.id) }, objDelete);

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