const ObjectId = require('mongodb').ObjectId
const Company = require('../models/CompanyModel')
const Response = require('../helpers/Response');

module.exports = {
    getListCompany: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;
            if (condition == null) {
                if (id == null) {
                    var dataCompany = await Company.find({ isDelete: false });
                } else {
                    var dataCompany = await Company.findOne({ _id: id, isDelete: false });
                }
            } else {
                var dataCompany = await Company.find(condition);
            }

            res.send(Response(200, "Thành công", dataCompany, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getNameCompany: async (req, res) => {
        try {
            const { company_id } = req.body;
            var result = await Company.findOne({ _id: company_id, isDelete: false });
            if (result) {
                res.send(Response(200, "Thành công", result, true));
            } else {
                res.send(Response(200, "Thất bại", result, false));
            }
        } catch (err) {
            res.send(Response(202, "Đã xảy ra lỗi ở: " + JSON.stringify(err.keyValue), err, false));
        }


    },

    addCompany: async (req, res) => {
        try {
            const { Name, Email, Phone, Fax, Address, Website, Code, Status, Image } = req.body;
            const result = await Company.create({
                "Name":Name,
                "Email": Email,
                "Phone": Phone,
                "Fax": Fax,
                "Address": Address,
                "Website": Website,
                "Code": Code,
                "Status": Status,
                "Logo": Image
            });
            if (result) {
                res.send(Response(200, "Thành công", result, true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateCompany: async (req, res) => {
        try {
            const { Name, Email, Phone, Fax, Address, Website, Code, Status, Image, id } = req.body;
            const objUpdate = {
                "Name": Name,
                "Email": Email,
                "Phone": Phone,
                "Fax": Fax,
                "Address": Address,
                "Website": Website,
                "Code": Code,
                "Status": Status,
                "Logo": Image
            };

            let result = await Company.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteCompany: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await Company.updateOne({ _id: ObjectId(body.id) }, objDelete);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addImage: async (req, res) => {
        res.send(Response(200, "Thành công", req.file, true));
    },

    //
}