const ObjectId = require('mongodb').ObjectId
const HistorySkin = require('../../models/Hardward/HistorySkinModel')
const User = require('../../models/UserModel')
const Response = require('../../helpers/Response');

module.exports = {
    getListHistorySkin: async (req, res) => {
        try {
            // if(req.role == "ADMIN") {
            //     var result = await HistorySkin.find({ isDelete: false }).populate("Company_Id", "Name").lean()
            // } else if(req.role == "COMPANY" || req.role == "SALES") {
            //     var result = await HistorySkin.find({ isDelete: false, Company_Id: req.user.Company_Id }).populate("Company_Id", "Name").lean()
            // }

            var result = await HistorySkin.find(
                {
                    Create_Date: {
                      $gte: "2024-01-01",
                     
                    }
                  }
            )
            .sort({'_id': -1})
            .populate("Company_Id", "Name").lean()
            
            var users = await User.find({ isDelete: false }).lean()

            let resultData = [];
            result.map(val => {
                let user = users.filter(v => v['_id'] == val['Sale_Id'])
                console.log(user)
                resultData.push(Object.assign(val, { Sale_Id: user.length > 0 ? user[0].Name : null }));
            })

            if (resultData) {
                res.send(Response(200, "Lấy danh sách lịch sử soi da thành công", resultData, true));
            } else {
                res.send(Response(202, "Lấy danh sách lịch sử soi da thất bại", [], true));
            }

        } catch (err) {
            res.send(Response(202, err.keyValue, err, false));
        }
    },

    getListHistorySkinBySale: async (req, res) => {
        try {
            var result = await HistorySkin.find({ isDelete: false, Sale_Id: req.body.sale_id }).populate("Company_Id", "Name").lean()
            var users = await User.find({ isDelete: false }).lean()

            let resultData = [];
            result.map(val => {
                let user = users.filter(v => v['_id'] == val['Sale_Id'])
                resultData.push(Object.assign(val, { Sale_Id: user.length > 0 ? user[0].Name : null }));
            })

            if (resultData) {
                res.send(Response(200, "Lấy danh sách lịch sử soi da theo sale thành công !!!", resultData, true));
            } else {
                res.send(Response(202, "Lấy danh sách lịch sử soi da theo sale thất bại !!!", [], true));
            }

        } catch (err) {
            res.send(Response(202, err.keyValue, err, false));
        }
    },

    getListHistorySkinByPhone: async (req, res) => {
        try {
            var result = await HistorySkin.find({ isDelete: false, Customer_Phone: req.body.phone }).populate("Company_Id", "Name").lean()
            var users = await User.find({ isDelete: false }).lean()

            let resultData = [];
            result.map(val => {
                let user = users.filter(v => v['_id'] == val['Sale_Id'])
                resultData.push(Object.assign(val, { Sale_Id: user.length > 0 ? user[0].Name : null }));
            })

            if (resultData) {
                res.send(Response(200, "Lấy danh sách lịch sử soi da theo sale thành công !!!", resultData, true));
            } else {
                res.send(Response(202, "Lấy danh sách lịch sử soi da theo sale thất bại !!!", [], true));
            }

        } catch (err) {
            res.send(Response(202, err.keyValue, err, false));
        }
    },

    getHistorybYId: async (req, res) => {
        let body = req.body;
        try {
            var result = await HistorySkin.findOne({  _id: ObjectId(body.id) })
            res.send(Response(200, "Lấy dữ liệu thành công !!!", result, true));
          

        } catch (err) {
            console.log(err);
            res.send(Response(202, err.keyValue, err, false));
        }
    },

    addHistorySkin: async (req, res) => {
        try {
            const { UserName, Result, Customer_Phone, Company_Id, Sale_Id } = req.body;
            const result = await HistorySkin.create({
                Result: JSON.stringify(Result),
                Customer_Phone: Customer_Phone,
                Company_Id: Company_Id,
                Sale_Id: Sale_Id
            });
            if (result) {
                let images = Result.facedata.image_info.url;
                await HistorySkin.updateOne({ _id: result._id }, { Image: images });
                res.send(Response(200, "Thêm lịch sử soi da thành công !!!", [], true));
            } else {
                res.send(Response(202, "Thêm lịch sử soi da thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    }
}