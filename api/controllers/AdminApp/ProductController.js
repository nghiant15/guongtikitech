const ObjectId = require("mongodb").ObjectId
const Brand = require('../../models/AdminApp/BrandModel')
const Type = require('../../models/AdminApp/TypeModel')
const Sku = require('../../models/AdminApp/SkuModel')
const Color = require('../../models/AdminApp/ColorModel')
const SubType = require('../../models/AdminApp/SubTypeModel')

const Product = {
    getAllProduct: async (req, res)=>{
        const { company_id } = req.query
        const brand = await Brand.find()
        const type = await SubType.find()
        const sku = await Sku.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id})
        const color = await Color.find()
    
        let result = [];
    
        sku.map((val) => {
            if(String(val.type_id) != '5fca7bb84baf79302ccfa681'){
                const b = brand.filter(
                    (v) => String(v["_id"]) == String(val["brand_id"])
                );
                const t = type.filter((v) => String(v["_id"]) == String(val["type_id"]))
                const c = color.filter((v) => String(v["_id"]) == String(val["color_id"]))
                result.push(
                    Object.assign(val.toObject(), {
                        type: t[0].vi || t[0].name,
                        brand: b[0].name,
                        color: c.length > 0 ? c[0] : null
                    })
                )
            }
        })
    
        res.json({
          status: 200,
          message: "Thành công",
          data: result
        })
    },
    addProduct: async (req, res)=>{
        const { type_id, brand_id, color_id, name, href, image, company_id = "" } = req.body

        if (
            type_id == null ||
            type_id.trim() == "" ||
            brand_id == null ||
            brand_id.trim() == "" ||
            name == null ||
            name.trim() == "" ||
            href == null ||
            href.trim() == "" ||
            image == null ||
            image.trim() == "" ||
            color_id == null ||
            color_id.trim() == ""
        ) {
            res.json({
                status: 201,
                message: "Miss params",
                data: null,
            })
            return
        }

        try {
            const date = new Date()
            const product = new Sku({
                type_id: ObjectId(type_id),
                brand_id: ObjectId(brand_id),
                color_id: ObjectId(color_id),
                name: name,
                href: href,
                company_id: company_id,
                image: image,
                create_date: date.getTime(),
                update_date: date.getTime()
            })
      
            await product.save()
      
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
    updateProduct: async (req, res) => {
        const { id, type_id, brand_id, color_id, name, href, image } = req.body
        if (
            id == null ||
            id.trim() == "" ||
            type_id == null ||
            type_id.trim() == "" ||
            brand_id == null ||
            brand_id.trim() == "" ||
            name == null ||
            name.trim() == "" ||
            href == null ||
            href.trim() == "" ||
            image == null ||
            image.trim() == "",
            color_id == null ||
            color_id.trim() == ""
        ) {
            res.json({
                status: 201,
                message: "Miss params",
                data: null,
            })
            return
        }
        try {
            const date = new Date()
            const update = {
                type_id: ObjectId(type_id),
                brand_id: ObjectId(brand_id),
                name: name,
                href: href,
                image: image,
                color_id: ObjectId(color_id),
                update_date: date.getTime()
            }
        
            await Sku.updateOne({ _id: ObjectId(id) }, update)
        
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
    getAllHair: async (req, res)=>{
        const { company_id } = req.query
        const brand = await Brand.find()
        const type = await SubType.find()
        const sku = await Sku.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id})
        const color = await Color.find()
    
        let result = [];
    
        sku.map((val) => {
            if(String(val.type_id) == '5fca7bb84baf79302ccfa681'){
                const b = brand.filter(
                    (v) => String(v["_id"]) == String(val["brand_id"])
                );
                const t = type.filter((v) => String(v["_id"]) == String(val["type_id"]))
                const c = color.filter((v) => String(v["_id"]) == String(val["color_id"]))
                result.push(
                    Object.assign(val.toObject(), {
                        type: t[0].vi || t[0].name,
                        brand: b[0].name,
                        color: c.length > 0 ? c[0] : null
                    })
                )
            }
        })
    
        res.json({
          status: 200,
          message: "Thành công",
          data: result
        })
    },
}

module.exports = Product