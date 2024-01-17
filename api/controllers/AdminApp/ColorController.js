const ObjectId = require("mongodb").ObjectId
const Brand = require('../../models/AdminApp/BrandModel')
const Type = require("../../models/AdminApp/TypeModel")
const Sku = require("../../models/AdminApp/SkuModel")
const ColorModel = require("../../models/AdminApp/ColorModel")
const SubType = require("../../models/AdminApp/SubTypeModel")

const Color = {
    getAllColor: async (req, res)=>{
        const { company_id } = req.query
        const type = await SubType.find()
        const sku = await Sku.find()
        const color = await ColorModel.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id})
    
        let product = []
    
        sku.map((val) => {
            const t = type.filter((v) => String(v["_id"]) == String(val["type_id"]))
            product.push(
                Object.assign(val.toObject(), {
                    type: t[0].vi || t[0].name
                })
            )
        })

        let c = []
        color.map(val=>{
            const p = product.filter(v=>String(v["color_id"]) == String(val["_id"]))
            if(p.length > 0){
                if(String(p[0].type_id) != '5fca7bb84baf79302ccfa681'){
                    c.push(Object.assign(val.toObject(),{
                        type: p[0].type
                    }))
                }
            }else{
                c.push(Object.assign(val.toObject()))
            }
        })

        res.json({
            status: 200,
            message: "Thành công",
            data: c
        })
    },
    addColor: async (req, res) => {
        const { hex, makeup_id, alpha = 50, ver = 'v4', company_id = ""} = req.body
        if (
            hex == null ||
            hex.trim() == "" ||
            alpha == null ||
            makeup_id == null ||
            makeup_id.trim() == ""
        ) {
          res.json({
            status: 201,
            message: "Miss params",
            data: null,
          })
          return
        }
        let numAlpha = 50
        try{
            numAlpha = Number.parseInt(alpha)
        }catch(e){
            numAlpha = 50
        }

        try {
            const date = new Date()
            const color = new ColorModel({
                hex: hex,
                makeup_id: makeup_id,
                alpha: numAlpha,
                ver: ver,
                company_id: company_id,
                create_date: date.getTime(),
                update_date: date.getTime()
            })
        
            await color.save()
        
            res.json({
                status: 200,
                message: "Thành công",
                data: null,
            })
        } catch (err) {
            res.json({
                status: 201,
                message: err,
                data: null,
            })
        }
    },
    updateColor: async (req, res) => {
        const { id, hex, makeup_id, alpha, ver = 'v4' } = req.body;
        if (
          id == null ||
          id.trim() == "" ||
          hex == null ||
          hex.trim() == "" ||
          makeup_id == null ||
          makeup_id.trim() == "" ||
          alpha == null
        ) {
          res.json({
            status: 201,
            message: "Miss params",
            data: null,
          });
          return;
        }
        try {
            const date = new Date()
            const update = {
                hex: hex,
                makeup_id: makeup_id,
                alpha: Number(alpha),
                ver: ver,
                update_date: date.getTime()
            };
        
            await ColorModel.updateOne({ _id: ObjectId(id) }, update);
        
            res.json({
                status: 200,
                message: "Thành công",
                data: null,
            });
        } catch (err) {
            res.json({
                status: 201,
                message: err.message,
                data: null,
            });
        }
    },
    getAllColorHair: async (req, res)=>{
        const { company_id } = req.query
        const type = await SubType.find()
        const sku = await Sku.find()
        const color = await ColorModel.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id})
    
        let product = []
    
        sku.map((val) => {
            const t = type.filter((v) => String(v["_id"]) == String(val["type_id"]))
            product.push(
                Object.assign(val.toObject(), {
                    type: t[0].vi || t[0].name
                })
            )
        })

        let c = []
        color.map(val=>{
            const p = product.filter(v=>String(v["color_id"]) == String(val["_id"]))
            if(p.length > 0){
                if(String(p[0].type_id) == '5fca7bb84baf79302ccfa681'){
                    c.push(Object.assign(val.toObject(),{
                        type: p[0].type
                    }))
                }
            }else{
                c.push(Object.assign(val.toObject()))
            }
        })

        res.json({
            status: 200,
            message: "Thành công",
            data: c
        })
    }
}

module.exports = Color