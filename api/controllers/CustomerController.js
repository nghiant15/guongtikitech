const ObjectId = require('mongodb').ObjectId
const Customer = require('../models/CustomerModel')
const Response = require('../helpers/Response');
const lodash = require("lodash");
const md5 = require("md5");
const jwt = require('jsonwebtoken');

function countType(arr, phone) {
    const count = arr.filter(data => data.Phone == phone);
    return count.length;
}

async function count_coefficient_SALE(dataResult, company_id, sale_id) {

    let arrTemp = [];
    for (let i = 0; i < dataResult.length; i++) {
        let getTimeUser = await Customer.find({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Company_Id": company_id,
            "Phone": dataResult[i].Phone,
            "Sale_Id": sale_id
        }, `Create_Date`).limit(1).lean()

        let countTimeUser = await Customer.countDocuments({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Company_Id": company_id,
            "Phone": dataResult[i].Phone,
            "Sale_Id": sale_id
        }).lean()
        getTimeUser[0].count = countTimeUser;
        arrTemp.push(getTimeUser[0])
    }

    let arrRes = []

    dataResult.map(async (val) => {
        let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
        let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
        arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
    });

    return arrRes;
}

async function count_coefficient_COMPANY(dataResult, company_id) {
    let arrTemp = [];
    for (let i = 0; i < dataResult.length; i++) {
        let getTimeUser = await Customer.find({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Company_Id": company_id,
            "Phone": dataResult[i].Phone,
        }, `Create_Date`).limit(1).lean()

        let countTimeUser = await Customer.countDocuments({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Company_Id": company_id,
            "Phone": dataResult[i].Phone
        }).lean()
        getTimeUser[0].count = countTimeUser;
        arrTemp.push(getTimeUser[0])
    }

    let arrRes = []

    dataResult.map(async (val) => {
        let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
        let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
        arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
    });

    return arrRes;
}

async function count_coefficient_ADMIN(dataResult) {
    let arrTemp = [];
    for (let i = 0; i < dataResult.length; i++) {
        let getTimeUser = await Customer.find({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Phone": dataResult[i].Phone,
        }, `Create_Date`).limit(1).lean()

        let countTimeUser = await Customer.countDocuments({
            "Create_Date": {
                "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
            },
            "Phone": dataResult[i].Phone
        }).lean()
        getTimeUser[0].count = countTimeUser;
        arrTemp.push(getTimeUser[0])
    }

    let arrRes = []

    dataResult.map(async (val) => {
        let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
        let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
        arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
    });

    return arrRes;
}

module.exports = {
    //User Table
    getListCustomer: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition } = req.body;

            if (condition == null) {
                if (req.role == 'ADMIN' || req.role == 'ADMINSALE') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false }).lean();
                    }
                } else if (req.role == 'COMPANY' || req.role == 'SHOPMANAGER') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id }).lean();
                    }
                } else if (req.role == 'SALES') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
                    }
                }
            } else {
                var dataCustomer = await Customer.find(condition).lean();
            }

            let dataResult = [];
            let company_id = req.company_id;
            let sale_id = req.user._id;

            dataCustomer.map(async (val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(dataCustomer, val.Phone)

                    dataResult.push(Object.assign(val, { count: count }));
                }
            });

            if (req.role == "SALES") {
                let arrRes = await count_coefficient_SALE(dataResult, company_id, sale_id);
                res.send(Response(200, "Thành công", arrRes, true));
            } else if (req.role == "COMPANY") {
                let arrRes = await count_coefficient_COMPANY(dataResult, company_id);
                res.send(Response(200, "Thành công", arrRes, true));
            } else if (req.role == "ADMIN") {
                let arrRes = await count_coefficient_ADMIN(dataResult);
                res.send(Response(200, "Thành công", arrRes, true));
            }

        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getListCustomer_V2: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition, index } = req.body;
         

            if (condition == null) {
                if (req.role == 'ADMIN' || req.role == 'ADMINSALE') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false }).lean();
                    }
                } else if (req.role == 'COMPANY' || req.role == 'SHOPMANAGER') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id }).lean();
                    }
                } else if (req.role == 'SALES') {
                    if (id == null) {
                        var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
                    } else {
                        var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
                    }
                }
            } else {
                var dataCustomer = await Customer.find(condition).lean();
            }

            let dataResult = [];
            let company_id = req.company_id;
            let sale_id = req.user._id;

            dataCustomer.map(async (val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(dataCustomer, val.Phone)

                    dataResult.push(Object.assign(val, { count: count }));
                }
            });

            var i, j, temparray, chunk = 5, arrChunk = [];

            for (i = 0, j = dataResult.length; i < j; i += chunk) {
                temparray = dataResult.slice(i, i + chunk);
                arrChunk.push(temparray);
            }

            if (req.role == "SALES") {
                let arrRes = await count_coefficient_SALE(arrChunk[index], company_id, sale_id);
                res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            } else if (req.role == "COMPANY") {
                let arrRes = await count_coefficient_COMPANY(arrChunk[index], company_id);
                res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            } else if (req.role == "ADMIN") {
                let arrRes = await count_coefficient_ADMIN(arrChunk[index]);
                res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            }

        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getListCustomer_V3: async (req, res) => {
        try {
            const { id } = req.query;
            const { condition, index } = req.body;
         

            // if (condition == null) {
            //     if (req.role == 'ADMIN' || req.role == 'ADMINSALE') {
            //         if (id == null) {
            //             var dataCustomer = await Customer.find({ isDelete: false }).lean();
            //         } else {
            //             var dataCustomer = await Customer.findOne({ _id: id, isDelete: false }).lean();
            //         }
            //     } else if (req.role == 'COMPANY' || req.role == 'SHOPMANAGER') {
            //         if (id == null) {
            //             var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id }).lean();
            //         } else {
            //             var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id }).lean();
            //         }
            //     } else if (req.role == 'SALES') {
            //         if (id == null) {
            //             var dataCustomer = await Customer.find({ isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
            //         } else {
            //             var dataCustomer = await Customer.findOne({ _id: id, isDelete: false, Company_Id: req.company_id, Sale_Id: req.user._id }).lean();
            //         }
            //     }
            // } else {
            //     var dataCustomer = await Customer.find(condition).lean();
            // }

            var dataCustomer = await Customer.find(
                {
                    Create_Date: {
                      $gte: "2024-01-01",
                     
                    }
                  }
            )
            .sort({'_id': -1}).lean();

            let dataResult = [];
            // let company_id = req.company_id;
            // let sale_id = req.user._id;

            dataCustomer.map(async (val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(dataCustomer, val.Phone)

                    dataResult.push(Object.assign(val, { count: count }));
                }
            });

            var i, j, temparray, chunk = 5, arrChunk = [];

            for (i = 0, j = dataResult.length; i < j; i += chunk) {
                temparray = dataResult.slice(i, i + chunk);
                arrChunk.push(temparray);
            }

            // if (req.role == "SALES") {
            //     let arrRes = await count_coefficient_SALE(arrChunk[index], company_id, sale_id);
            //     res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            // } else if (req.role == "COMPANY") {
            //     let arrRes = await count_coefficient_COMPANY(arrChunk[index], company_id);
            //     res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            // } else if (req.role == "ADMIN") {
            //     let arrRes = await count_coefficient_ADMIN(arrChunk[index]);
            //     res.send(Response(200, "Thành công", { data: arrRes, count: arrChunk.length }, true));
            // }

            // let arrRes = await count_coefficient_ADMIN(arrChunk[index]);
            res.send(Response(200, "Thành công", { data: dataCustomer, count:dataCustomer.length }, true));

        } catch (err) {
            console.log(err);
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    getListDetailAppear: async (req, res) => {
        try {
            const { phone } = req.body;

            // if (req.role == 'ADMIN' || req.role == 'ADMINSALE') {
            //     var dataCustomer = await Customer.find({ Phone: phone }).populate("Sale_Id", `Name`).lean();
            // } else if (req.role == 'COMPANY' || req.role == 'SHOPMANAGER') {
            //     var dataCustomer = await Customer.find({ Company_Id: req.company_id, Phone: phone }).lean();
            // }

            var dataCustomer = await Customer.find({ Phone: phone }).populate("Sale_Id", `Name`).lean();
          
            if(dataCustomer) {
                res.send(Response(200, "Lấy chi tiết thành công !!!", dataCustomer, true));
            } else {
                res.send(Response(200, "Lấy chi tiết thất bại !!!", [], true));
            }

        } catch (err) {
            res.send(Response(202, JSON.stringify(err), err, false));
        }
    },

    loginCustomer: async (req, res) => {
        try {
            const { phone, password } = req.body;
            var dataCustomer = await Customer.findOne({ Phone: phone, Password: password });
            if (dataCustomer != null) {
                const token = jwt.sign({ _id: dataCustomer._id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
                res.send(Response(200, "Đăng nhập thành công !!!", { "data": dataCustomer, "token": token }, true));
            } else {
                res.send(Response(202, "Đăng nhập thất bại !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListCustomer_Sale_Heso: async (req, res) => {
        try {
            const { company_id, phone, sale_id } = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
                },
                "Company_Id": company_id,
                "Phone": phone,
                "Sale_Id": sale_id
            }).limit(1)

            if (result) {
                var hesoUser_Of_Company = (new Date(result[0].Create_Date).getMonth() + 1) - 1;
                res.send(Response(200, "Thành công", { "calculator": result.length / hesoUser_Of_Company }, true));
            } else {
                res.send(Response(202, "Thất bại", result, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListCustomer_Heso: async (req, res) => {
        try {
            const { company_id, phone } = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-12-31T03:27:49.926Z`
                },
                "Company_Id": company_id,
                "Phone": phone
            })

            if (result) {
                var hesoUser_Of_Company = (new Date(result[0].Create_Date).getMonth() + 1) - 1;
                res.send(Response(200, "Thành công", { "calculator": result.length / hesoUser_Of_Company }, true));

            } else {
                res.send(Response(202, "Thất bại", result, false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    addCustomer: async (req, res) => {
        try {
            let body = req.body;
            let countTimeUser = await Customer.countDocuments({
                "Phone": body.Phone
            })

            const result = await Customer.create({
                "Name": body.Name,
                "Email": body.Email,
                "Phone": body.Phone,
                "Gender": body.Gender,
                "Password": md5(body.Password),
                "Company_Id": body.Company_Id,
                "Sale_Id": body.Sale_Id,
            });

            if (result) {
                if (countTimeUser > 0) {
                    await Customer.updateMany({
                        "Phone": body.Phone,
                    }, {
                        $set: {
                            "Name": body.Name,
                            "Email": body.Email,
                            "Password": md5(body.Password),
                        }
                    });
                }

                res.send(Response(200, "Thêm người dùng thành công", result, true));
            } else {
                res.send(Response(202, "Thêm người dùng thất bại", [], false));
            }


        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    //Cho admin
    getCustomerByMonth_Admin: async (req, res) => {
        try {
            let body = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-${body.month}-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                }
            })
            let dataResult = [];
            let arrTemp = [];

            result.map((val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(result, val.Phone)
                    dataResult.push(Object.assign(val.toObject(), { count: count }));
                }
            });

            for (let i = 0; i < dataResult.length; i++) {
                let getTimeUser = await Customer.find({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                    },
                    "Phone": dataResult[i].Phone,
                }, `Create_Date`).limit(1).lean()

                let countTimeUser = await Customer.countDocuments({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                    },
                    "Phone": dataResult[i].Phone
                }).lean()
                getTimeUser[0].count = countTimeUser;
                arrTemp.push(getTimeUser[0])
            }

            let arrRes = []

            dataResult.map(async (val) => {
                let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
                if (coefficientData.length > 0) {
                    let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
                    arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
                }
            });

            res.send(Response(200, "Thành công", arrRes, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    //For company
    getCustomerByMonth: async (req, res) => {
        try {
            let body = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-${body.month}-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                },
                "Company_Id": body.company_id
            })
            let dataResult = [];
            let arrTemp = [];

            result.map((val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(result, val.Phone)
                    dataResult.push(Object.assign(val.toObject(), { count: count }));
                }
            });

            for (let i = 0; i < dataResult.length; i++) {
                let getTimeUser = await Customer.find({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                    },
                    "Company_Id": body.company_id,
                    "Phone": dataResult[i].Phone,
                }, `Create_Date`).limit(1).lean()

                let countTimeUser = await Customer.countDocuments({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${body.month}-31T03:27:49.926Z`
                    },
                    "Company_Id": body.company_id,
                    "Phone": dataResult[i].Phone
                }).lean()
                getTimeUser[0].count = countTimeUser;
                arrTemp.push(getTimeUser[0])
            }

            let arrRes = []

            dataResult.map(async (val) => {
                let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
                let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
                arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
            });

            res.send(Response(200, "Thành công", arrRes, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getChart_Company: async (req, res) => {
        try {
            const { company_id } = req.body;
            const monthsArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            const result = await Customer.aggregate([
                {
                    $match: {
                        "Company_Id": company_id,
                    }
                },
                {
                    $group: {
                        _id: { "year_month": { $substrCP: ["$Create_Date", 0, 7] } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year_month": 1 }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        month_year: {
                            $concat: [
                                { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                                "-",
                                { $substrCP: ["$_id.year_month", 0, 4] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { k: "$month_year", v: "$count" } }
                    }
                },
                {
                    $project: {
                        data: { $arrayToObject: "$data" },
                        _id: 0
                    }
                }
            ])

            let arrTemp = [];

            for (const [key, value] of Object.entries(result[0].data)) {
                let keys = key.split("-")
                arrTemp.push({
                    month: keys[0],
                    year: keys[1],
                    value: value
                })
            }

            let arrRes = []

            for (let i = 1; i <= 12; i++) {
                let sort = lodash.find(arrTemp, { month: String(i) });
                if (sort == undefined) {
                    arrRes.push(0)
                } else {
                    arrRes.push(Number(sort.value))
                }
            }

            res.send(Response(200, "Tính toán dữ liệu thành công !!!", arrRes, true));
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getChart_Admin: async (req, res) => {
        try {
            const monthsArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            const result = await Customer.aggregate([
                {
                    $match: {}
                },
                {
                    $group: {
                        _id: { "year_month": { $substrCP: ["$Create_Date", 0, 7] } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year_month": 1 }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        month_year: {
                            $concat: [
                                { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                                "-",
                                { $substrCP: ["$_id.year_month", 0, 4] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { k: "$month_year", v: "$count" } }
                    }
                },
                {
                    $project: {
                        data: { $arrayToObject: "$data" },
                        _id: 0
                    }
                }
            ])

            let arrTemp = [];

            for (const [key, value] of Object.entries(result[0].data)) {
                let keys = key.split("-")
                arrTemp.push({
                    month: keys[0],
                    year: keys[1],
                    value: value
                })
            }

            let arrRes = []

            for (let i = 1; i <= 12; i++) {
                let sort = lodash.find(arrTemp, { month: String(i) });
                if (sort == undefined) {
                    arrRes.push(0)
                } else {
                    arrRes.push(Number(sort.value))
                }
            }

            res.send(Response(200, "Tính toán dữ liệu thành công !!!", arrRes, true));
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getChart_Sale: async (req, res) => {
        try {
            const { company_id, sale_id } = req.body;
            const monthsArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
            const result = await Customer.aggregate([
                {
                    $match: {
                        "Company_Id": company_id,
                        "Sale_Id": sale_id
                    }
                },
                {
                    $group: {
                        _id: { "year_month": { $substrCP: ["$Create_Date", 0, 7] } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year_month": 1 }
                },
                {
                    $project: {
                        _id: 0,
                        count: 1,
                        month_year: {
                            $concat: [
                                { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                                "-",
                                { $substrCP: ["$_id.year_month", 0, 4] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: { $push: { k: "$month_year", v: "$count" } }
                    }
                },
                {
                    $project: {
                        data: { $arrayToObject: "$data" },
                        _id: 0
                    }
                }
            ])

            let arrTemp = [];

            for (const [key, value] of Object.entries(result[0].data)) {
                let keys = key.split("-")
                arrTemp.push({
                    month: keys[0],
                    year: keys[1],
                    value: value
                })
            }

            let arrRes = []

            for (let i = 1; i <= 12; i++) {
                let sort = lodash.find(arrTemp, { month: String(i) });
                if (sort == undefined) {
                    arrRes.push(0)
                } else {
                    arrRes.push(Number(sort.value))
                }
            }

            res.send(Response(200, "Tính toán dữ liệu thành công !!!", arrRes, true));
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    //For sale
    saleGetCustomer_by_month: async (req, res) => {
        try {
            const { company_id, sale_id, month } = req.body;
            var result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-${month}-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-${month}-31T03:27:49.926Z`
                },
                "Company_Id": company_id,
                "Sale_Id": sale_id
            })

            let dataResult = [];
            let arrTemp = [];

            result.map((val) => {
                if (!dataResult.some(item => val.Phone == item.Phone)) {
                    const count = countType(result, val.Phone)
                    dataResult.push(Object.assign(val.toObject(), { count: count }));
                }
            });

            for (let i = 0; i < dataResult.length; i++) {
                let getTimeUser = await Customer.find({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${month}-31T03:27:49.926Z`
                    },
                    "Company_Id": company_id,
                    "Phone": dataResult[i].Phone,
                    "Sale_Id": sale_id
                }, `Create_Date`).limit(1).lean()

                let countTimeUser = await Customer.countDocuments({
                    "Create_Date": {
                        "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                        "$lte": `${new Date().getFullYear()}-${month}-31T03:27:49.926Z`
                    },
                    "Company_Id": company_id,
                    "Phone": dataResult[i].Phone,
                    "Sale_Id": sale_id
                }).lean()
                getTimeUser[0].count = countTimeUser;
                arrTemp.push(getTimeUser[0])
            }

            let arrRes = []

            dataResult.map(async (val) => {
                let coefficientData = arrTemp.filter((v) => String(v._id) == String(val._id));
                let coefficientTime = (new Date(coefficientData[0].Create_Date).getMonth() + 1) - 1;
                arrRes.push(Object.assign(val, { coefficient: coefficientData[0].count / coefficientTime }));
            });

            res.send(Response(200, "Thành công", arrRes, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    cal_hesoUser: async (req, res) => {
        try {
            const { month, company_id, phone } = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-${month}-31T03:27:49.926Z`
                },
                "Company_Id": company_id,
                "Phone": phone
            })
            if (result) {

                var monthCount = (new Date(result[0].Create_Date).getMonth() + 1) - 1;
                res.send(Response(200, "Thành công", { "calculator": result.length / monthCount }, true));

            } else {
                res.send(Response(202, "Thất bại", result, false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    cal_hesoUser_per_sale: async (req, res) => {
        try {
            const { month, company_id, phone, sale_id } = req.body;
            const result = await Customer.find({
                "Create_Date": {
                    "$gte": `${new Date().getFullYear()}-01-01T03:27:49.926Z`,
                    "$lte": `${new Date().getFullYear()}-${month}-31T03:27:49.926Z`
                },
                "Company_Id": company_id,
                "Phone": phone,
                "Sale_Id": sale_id
            })
            if (result) {
                var monthCountPer_Sale = (new Date(result[0].Create_Date).getMonth() + 1) - 1;
                res.send(Response(200, "Thành công", { "calculator": result.length / monthCountPer_Sale }, true));

            } else {
                res.send(Response(202, "Thất bại", result, false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }
}