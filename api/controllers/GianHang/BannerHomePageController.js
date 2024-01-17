const ObjectId = require('mongodb').ObjectId
const BannerHomePage = require('../../models/Hardward/BannerHomePageModel')
const Response = require('../../helpers/Response');

module.exports = {
    //User Table
    getListBannerHomePage: async (req, res) => {
        try {
            var dataBannerHomePage = await BannerHomePage.find({ isdelete: false }).lean()
             
            res.send(Response(200, "Lấy dữ liệu thành công", dataBannerHomePage, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getBannerHomePageByID: async (req, res) => {
        try {
            var dataBannerHomePage = await BannerHomePage.findOne({ isdelete: false, _id: req.body.id }).lean()
             
            res.send(Response(200, "Lấy dữ liệu thành công", dataBannerHomePage, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addBannerHomePage: async (req, res) => {
        try {
            const { name, image, link } = req.body;
            const result = await BannerHomePage.create({
                "image": image,
                "link": link
            });
            if (result) {
                res.send(Response(200, "Thêm danh mục thành công", result, true));
            } else {
                res.send(Response(202, result, [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateBannerHomePage: async (req, res) => {
        try {
            const { name, image, vi, link, id } = req.body;
            
            const objUpdate = {
                "image": image,
                "link": link
            };

            let result = await BannerHomePage.updateOne({ _id: ObjectId(id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Success", [], true));
            } else {
                res.send(Response(202, "Fail", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteBannerHomePage: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isdelete": true
        };
        let result = await BannerHomePage.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Success", [], true));
        } else {
            res.send(Response(202, "Fail", [], false));
        }

    },

    addImage: async (req, res) => {
        const data = req.file
        res.send(Response(200, "Success", data, true));

    },
}