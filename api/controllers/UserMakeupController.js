const ObjectId = require('mongodb').ObjectId;
const User = require('../models/UserMakeupModel');

module.exports={
    addUser: async (req, res)=>{
        try{
            const {email, name, avatar, device, phone, age} = req.body;
            if((email == null || email == '') && (phone == null || phone == '')){
                res.json({
                    status: 201,
                    message: "Miss params",
                    data: null
                });
                return;
            }

            const u = email == null || email == "" ? null : await User.findOne({email: email});
            const u1 = phone == null || phone == "" ? null : await User.findOne({phone: phone});
            const date = new Date()
            let id = ""
            if(u){
                id = u["_id"]
                let update = {
                    email: email || "",
                    name: name || "",
                    avatar: avatar || "",
                    isActive: true,
                    dateUpdate: date.getTime(),
                    device: device || {},
                    phone: phone || "",
                    age: age || "",
                    type: "Email"
                }
                if(email == null || email == ''){
                    update = {
                        name: name || "",
                        avatar: avatar || "",
                        isActive: true,
                        dateUpdate: date.getTime(),
                        device: device || {},
                        phone: phone || "",
                        age: age || "",
                        type: "Email"
                    }
                }
                if(phone == null || phone == ''){
                    update = {
                        email: email || "",
                        name: name || "",
                        avatar: avatar || "",
                        isActive: true,
                        dateUpdate: date.getTime(),
                        device: device || {},
                        age: age || "",
                        type: "Email"
                    }
                }
                
                await User.updateOne({_id: ObjectId(u["_id"])}, update)

            }else if(u1){
                id = u1["_id"]
                let update = {
                    email: email || "",
                    name: name || "",
                    avatar: avatar || "",
                    isActive: true,
                    dateUpdate: date.getTime(),
                    device: device || {},
                    phone: phone || "",
                    age: age || "",
                    type: "Phone"
                }
                if(email == null || email == ''){
                    update = {
                        isActive: true,
                        dateUpdate: date.getTime(),
                        device: device || {},
                        phone: phone || "",
                        age: age || "",
                        type: "Phone"
                    }
                }
                if(phone == null || phone == ''){
                    update = {
                        email: email || "",
                        name: name || "",
                        avatar: avatar || "",
                        isActive: true,
                        dateUpdate: date.getTime(),
                        device: device || {},
                        age: age || "",
                        type: "Phone"
                    }
                }
                await User.updateOne({_id: ObjectId(u1["_id"])}, update)

            }else{
                const user = new User({
                    email: email || "",
                    name: name || "",
                    avatar: avatar || "",
                    isActive: true,
                    dateUpdate: date.getTime(),
                    device: device || {},
                    phone: phone || "",
                    age: age || "",
                    type: phone != null || phone != "" ? "Phone" : "Email"
                });

                const userNew =  await user.save();
                id = userNew['_id']
            }

            res.json({
                status: 200,
                message: "Thành công",
                data: {
                    userID : id
                }
            });
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    },
    getInfo: async (req, res)=>{
        try{
            const {id} = req.body;

            const u = await User.findOne({_id: ObjectId(id)});

            if(u){
                res.json({
                    status: 200,
                    message: "Thành công",
                    data: u
                });
            }else{
                res.json({
                    status: 201,
                    message: "No user",
                    data: null
                });
            }
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    },
    getUser: async (req, res)=>{
        try{
            const u = await User.find().sort({dateUpdate: -1});
            res.json({
                status: 200,
                message: "Thành công",
                data: u
            });
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    },
    registerDevice: async(req, res)=>{
        const {id, device} = req.body;
        if(id == null || id == ''
        || device == null || device == ''){
            res.json({
                status: 201,
                message: "Miss params",
                data: null
            });
            return;
        }
        try{
            const update = {
                device: device
            }

            await User.updateOne({_id: ObjectId(id)}, update)
            res.json({
                status: 200,
                message: "success",
                data: null
            });
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    },
    updateUser: async (req, res)=>{
        try{
            const {id, email, age, name, avatar, gender, phone, type} = req.body;

            if(id == null || id == ''
            || (email == null || email == '') && (phone == null || phone == '')
            ){
                res.json({
                    status: 201,
                    message: "Miss params",
                    data: null
                });
                return;
            }
            const date = new Date()
            const update = {
                email: email || "",
                age: age || "",
                name: name || "",
                gender: gender || "",
                avatar: avatar || "",
                dateUpdate: date.getTime(),
                phone: phone || "",
                type: type
            }

            if(type == null || type == ""){
                delete update.type
            }

            await User.updateOne({_id: ObjectId(id)}, update)

            res.json({
                status: 200,
                message: "Thành công",
                data: null
            });
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    },
    deleteUser:  async (req, res)=>{
        try{
            const {id} = req.body
            if(id == null || id.trim() == ''){
                res.json({
                    status: 201,
                    message: "Miss params",
                    data: null
                });
                return;
            }

            await User.deleteOne({_id: ObjectId(id)})

            res.json({
                status: 200,
                message: "Thành công",
                data: null
            });
        }catch(err){
            res.json({
                status: 201,
                message: err.message,
                data: null
            });
        }
    }
}