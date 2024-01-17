const ObjectId = require('mongodb').ObjectId
const User = require('../models/UserModel')
const Role = require('../models/RoleModel')
const Response = require('../helpers/Response');
var sendMail = require('../services/service_mail');
const Link = require('../models/LinkMarkerModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const CompanyModel = require('../models/CompanyModel');
const seeder = require('./../middleware/seeder')
module.exports = {
    //User Table
    getListUser: async (req, res) => {
        try {
            const { id, limit } = req.query;
            const { condition } = req.body;
            if (condition == null) {
                if (id == null) {
                    var dataUser = await User.find({ isDelete: false }).limit(Number(limit));
                } else {
                    var dataUser = await User.findOne({ _id: id, isDelete: false }).limit(Number(limit));
                }
            } else {
                var dataUser = await User.find(condition).limit(Number(limit));
            }

            res.send(Response(200, "Thành công", dataUser, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getUserByID: async (req, res) => {
        try {
            var body = req.body;
            var dataUser = await User.findOne({ _id: req.user._id, isDelete: false }).populate("Role_Id").populate("Company_Id").lean();

            if (dataUser) {
                res.send(Response(200, "Thành công", dataUser, true));
            } else {
                res.send(Response(200, "Fail to load user", [], true));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    VerifyUser: async (req, res) => {
        try {
            const { phone, company_id } = req.body;

            var dataUser = await User.findOne({ Phone: phone, Company_Id: company_id });
            var role = await Role.findOne({ _id: dataUser.Role_Id });

            if (dataUser != null) {
                const token = jwt.sign({ _id: dataUser._id, role: role.Name }, "1234567890qwertyuiopasdfghjklzxcvbnm");
                res.send(Response(200, "Login Success !!!", { "data": dataUser, "token": token }, true));
            } else {
                res.send(Response(202, "Login Fail !!!", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListShopManager: async (req, res) => {
        try {
            const { company_id } = req.body;
         
            const arrShopManager = [];
            
            let filterSearch = { isDelete: false };

            const dataUser = await User.find(filterSearch)
        
                .populate("Role_Id", "Name")
                .lean();

        
                
            
            for (let i = 0; i < dataUser.length; i++) {
                if(company_id != undefined) {

                    if (dataUser[i].Role_Id.Name == 'SHOPMANAGER' && dataUser[i].Company_Id == company_id) {
                        arrShopManager.push(dataUser[i]);
                    } 
                } else {
                    if (dataUser[i].Role_Id.Name == 'SHOPMANAGER') {
                        arrShopManager.push(dataUser[i]);
                    } 
                }
                
            }
            

            res.send(Response(200, "Thành công", arrShopManager, true));

        } catch (err) {
            console.log(err);
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },
    getListShopManager2: async (req, res) => {
        try {
            const { company_id } = req.query;
         
            const arrShopManager = [];
            
            let filterSearch = { isDelete: false };

            const dataUser = await User.find(filterSearch)
        
                .populate("Role_Id", "Name")
                .lean();

        
                
            
            for (let i = 0; i < dataUser.length; i++) {
                if(company_id != undefined) {

                    if (dataUser[i].Role_Id.Name == 'SHOPMANAGER' && dataUser[i].Company_Id == company_id) {
                        arrShopManager.push(dataUser[i]);
                    } 
                } else {
                    if (dataUser[i].Role_Id.Name == 'SHOPMANAGER') {
                        arrShopManager.push(dataUser[i]);
                    } 
                }
                
            }
            

            res.send(Response(200, "Thành công", arrShopManager, true));

        } catch (err) {
            console.log(err);
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },


    getSale_name: async (req, res) => {
        try {
            const { sale_id } = req.body;

            var dataUser = await User.find({ isDelete: false, _id: sale_id });
            if (dataUser) {
                res.send(Response(200, "Thành công", dataUser, true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getListSale: async (req, res) => {
        try {
            const { sale_id } = req.body;
          
            var role = req.role;
            var arrSale = [];

            if (role == 'ADMIN' || role == 'ADMINSALE') {
                var dataUser = await User.find({ isDelete: false })
                    .populate("Role_Id", `Name`)
                    .lean();
            } else if (role == 'COMPANY') {
                if (sale_id == null || sale_id == undefined) {
                    var dataUser = await User.find({ isDelete: false, Company_Id: req.company_id })
                        .populate("Role_Id", `Name`)
                        .lean()
                } else {
                    var dataUser = await User.find({ isDelete: false, Company_Id: req.company_id})
                        .populate("Role_Id", `Name`)
                        .lean();
                }
            }

            var companys = await CompanyModel.find({ isDelete: false }).lean()

            let data = [];
            dataUser.map((val) => {
                const com = companys.filter((v) => String(v["_id"]) == String(val["Company_Id"]));
                
                data.push(
                    Object.assign(val, {
                        company_name: com[0] == undefined ? "" : com[0].Name,
                    })
                );
            });

            for (let i = 0; i < dataUser.length; i++) {
                if (dataUser[i].Role_Id.Name == 'SALES') {
                    arrSale.push(dataUser[i]);
                }
            }
            res.send(Response(200, "Thành công", arrSale, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getSaleData: async (req, res) => {
        try {
            const { sale_id } = req.body;

            var dataUser = await User.find({ isDelete: false, _id: sale_id });
            if (dataUser) {
                res.send(Response(200, "Thành công", dataUser, true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    LoginAdmin: async (req, res) => {
        try {
            const { username, password } = req.body;
            var dataUser = await User.findOne({ UserName: username, Password: password, Status: "Actived" });
            console.log(dataUser)
            if (dataUser != null) {
                var role = await Role.findOne({ _id: dataUser.Role_Id });
                const token = jwt.sign({ _id: dataUser._id, role: role.Name, company_id: dataUser.Company_Id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
                res.send(Response(200, "Login Success !!!", { "data": dataUser, "token": token }, true));
            } else {
                res.send(Response(202, "Login Fail !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }

    },

    generateAuthToken: async (req, res) => {
        var user = this;
        const token = jwt.sign({ _id: user._id }, "1234567890qwertyuiopasdfghjklzxcvbnm");
        return token;
    },

    addUser: async (req, res) => {
        try {
            let body = req.body;
            console.log(body);
            if(body.Role_Id =="")
            {
                body.Role_Id ="65727d11424b4a0698883eda";
            }
            const result = await User.create({
                "Name": body.Name,
                "Email": body.Email,
                "Phone": body.Phone,
                "Gender": body.Gender,
                "Address": body.Address,
                "Company_Id": body.Company_Id,
                "Role_Id": body.Role_Id,
                "UserName": body.UserName,
                "Password": md5(body.Password),
                "Sale_Id": body.Sale_Id,
                "Code": body.Code
            });
            if (result) {
                //send Mail
                // await sendMail.verifyEmail(result.Name, result.Email,
                //     `${constans.baseURL}${constans.linkAPI}${result._id}&email=${result.Email}`);
           

                var role = await Role.findOne({ _id: ObjectId (body.Role_Id )});
                if (role.Name == 'COMPANY') {
                    await Link.create({
                        "Company_Id": body.Company_Id
                    });
                }
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, result, [], false));
            }
        } catch (err) {
            console.log(err);
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    updateUser: async (req, res) => {
        try {
            let body = req.body;
            const objUpdate = {
                "Name": body.Name,
                "Email": body.Email,
                "Phone": body.Phone,
                "Gender": body.Gender,
                "address": body.address,
                "Role_Id": body.Role_Id,
                "UserName": body.UserName,
                "Password": md5(body.Password),
                "Status": body.Status,
                "Code": body.Code
            };

            let result = await User.updateOne({ _id: ObjectId(body.id) }, objUpdate);

            if (result) {
                res.send(Response(200, "Thành công", [], true));
            } else {
                res.send(Response(202, "Thất bại", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    deleteUser: async (req, res) => {

        let body = req.body;
        const objDelete = {
            "isDelete": true
        };
        let result = await User.updateOne({ _id: ObjectId(body.id) }, objDelete);

        if (result) {
            res.send(Response(200, "Thành công", [], true));
        } else {
            res.send(Response(202, "Thất bại", [], false));
        }

    },

    updateStatus: async (req, res) => {
        try {
            let { id, email } = req.query;
            let result = await User.findOne({ _id: ObjectId(id), Email: email });
            if (result != null) {
                let isOk = await User.updateOne({ _id: ObjectId(id), Email: email }, { Status: "Actived" });
                if (isOk) {
                    res.send(Response(202, "Update status success", [], true));
                } else {
                    res.send(Response(202, "Update status fail", [], false));
                }
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    verifyPhone: async (req, res) => {

    },

    verifyEmail: async (req, res) => {
        try {
            await sendMail.verifyEmail();
            res.send(Response(200, "Ok", [], true));
        } catch (err) {
            res.send(Response(202, "Thất bại", err, false));
        }
    },

    resetPassword: async (req, res) => {
        try {
            let body = req.body;
            var resultUser = await User.findOne({ _id: ObjectId(body.id) });
            if (md5(body.old_password) == resultUser.Password) {
                if (body.new_password == body.confirm_password) {
                    const objUpdate = {
                        "Password": md5(body.new_password)
                    };

                    let result = await User.updateOne({ _id: ObjectId(body.id) }, objUpdate);

                    if (result) {
                        res.send(Response(200, "Update Password Success !!!", [], true));
                    } else {
                        res.send(Response(202, "Fail to update password !!!", [], false));
                    }
                }
            } else {
                res.send(Response(202, "Old password is incorrect !!!", [], false));
            }
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    },

    getSeederData: async (req, res) => {
        try {
            let body = req.body;
            var dataArr = [];
            for (let i = 0; i < seeder.data.data.length; i++) {
                if (seeder.data.data[i].email == body.email) {
                    dataArr.push(seeder.data.data[i])
                }
            }
            res.send(Response(200, "Seeder Data !!!", dataArr, true));
        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }
}