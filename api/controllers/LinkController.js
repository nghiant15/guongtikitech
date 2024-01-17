const ObjectId = require('mongodb').ObjectId
const Link = require('../models/LinkMarkerModel')
const Response = require('../helpers/Response');

module.exports = {
    getListLink: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;

            if (condition == null) {
                if (id == null) {
                    var result = await Link.find({ isDelete: false });
                } else {
                    var result = await Link.findOne({ _id: id, isDelete: false });
                }
            } else {
                var result = await Link.find(condition);
            }

            res.send(Response(200, "Thành công", result, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListLinkBy_ID: async (req, res) => {
        try {
            var result = await Link.findOne({isDelete: false, Company_Id: req.user.Company_Id });
            if(result){
                res.send(Response(200, "Success !!!", result, true));
            } else {
                res.send(Response(202, "Fail !!!", result, true));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err), err, false));
        }
    },

    addLink: async (req, res) => {
        try {
            let body = req.body;
            const result = await Link.create({
                "Company_Id": body.Company_Id,
                "link_shop": body.link_shop,
                "link_recommand": body.link_recommand,
                "link_sku_hair": body.link_sku_hair
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

    updateLink: async (req, res) => {
        try {
            let body = req.body;

            let result = await Link.updateOne({ Company_Id: req.user.Company_Id }, {
                link_shop: body.link_shop,
                link_recommand: body.link_recommand,
                link_sku_hair: body.link_sku_hair,
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

    deleteLink: async (req, res) => {
        try {
            let body = req.body;
            const objDelete = {
                "isDelete": true
            };
            let result = await Link.updateOne({ _id: ObjectId(body.id) }, objDelete);

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