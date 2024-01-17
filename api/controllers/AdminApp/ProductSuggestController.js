const ObjectId = require("mongodb").ObjectId
const Brand = require('../../models/AdminApp/BrandModel')
const Type = require('../../models/AdminApp/TypeModel')
const Sku = require('../../models/ProductSuggestModel')
const Color = require('../../models/AdminApp/ColorModel')
const SubType = require('../../models/AdminApp/SubTypeModel')

const ProductSuggest = {
    getAllProduct: async (req, res)=>{
        const { company_id, level } = req.query
        
        let result = await Sku.find({companyid: company_id, level: level })
    
    
       return   res.json({
          status: 200,
          message: "Thành công",
          data: result
        })
    },
    getAllProductSugest: async (req, res)=>{
        const { data } = req.body;

        let groupK5 = data.find(x => x.level === 'K5');
       
        let arraypush = [];
        if(groupK5)
        {
            
            let avg = groupK5.avg;
            if(avg <=1 )
            {
                avg = 1;
            }
            else  if(avg <=2 )
            {
                avg = 2;
            }
            else 
            {
                avg = 3;
            }
            let result = await Sku.find({ "level": groupK5.level, sdktype: avg });
            
           let  itemResult =  {
              "title":  "Lão hoá da",
              "data": result

            };
            arraypush.push(itemResult);   
         
        }


        let groupK6 = data.find(x => x.level === 'K6');
       
   
        if(groupK6)
        {
            
            let avg = groupK6.avg;
            if(avg <=1 )
            {
                avg = 1;
            }
            else  if(avg <=2 )
            {
                avg = 2;
            }
            else 
            {
                avg = 3;
            }
            result1 = await Sku.find({ "level": groupK6.level, sdktype: avg });
            
           let  itemResult1 =  {
              "title":  "Hỗ trợ điều trị mụn",
              "data": result1

            };
            arraypush.push(itemResult1);   
         
        }


        let groupK7 = data.find(x => x.level === 'K7');
       
   
        if(groupK7)
        {
            
            let avg = groupK7.avg;
            if(avg <=1 )
            {
                avg = 1;
            }
            else  if(avg <=2 )
            {
                avg = 2;
            }
            else 
            {
                avg = 3;
            }
            result1 = await Sku.find({ "level": groupK7.level, sdktype: avg });
            
           let  itemResult1 =  {
              "title":  "Hỗ trợ điều quầng thâm mắt",
              "data": result1

            };
            arraypush.push(itemResult1);   
         
        }

        let groupK8 = data.find(x => x.level === 'K8');
       
   
        if(groupK8)
        {
            
            let avg = groupK8.avg;
            if(avg <=1 )
            {
                avg = 1;
            }
            else  if(avg <=2 )
            {
                avg = 2;
            }
            else 
            {
                avg = 3;
            }
            result1 = await Sku.find({ "level": groupK8.level, sdktype: avg });
            
           let  itemResult1 =  {
              "title":  "Hỗ trợ điều lỗ chân lông",
              "data": result1

            };
            arraypush.push(itemResult1);   
         
        }

        let groupK9 = data.find(x => x.level === 'K9');
       
   
        if(groupK9)
        {
            
            let avg = groupK9.avg;
            if(avg <=1 )
            {
                avg = 1;
            }
            else  if(avg <=2 )
            {
                avg = 2;
            }
            else 
            {
                avg = 3;
            }
            result1 = await Sku.find({ "level": groupK9.level, sdktype: avg });
            
           let  itemResult1 =  {
              "title":  "Hỗ trợ giảm thâm nám da",
              "data": result1

            };
            arraypush.push(itemResult1);   
         
        }

        return res.json({
            status: 200,
            message: "Thành công",
            data: arraypush
          })

    
    },
    addProduct: async (req, res)=>{

    
        const { name,image, description, linkdetail, level, sdktype, companyid = "", brand } = req.body
        console.log(req.body);
       
        if (
            name == null ||
            name == "" ||
            image == null ||
            image == "" ||
            description == null ||
            description == "" ||
            linkdetail == null ||
            linkdetail == "" ||
            level == null ||
            level == "" ||
            sdktype == null ||
            sdktype == "" ||
            companyid == null ||
            companyid == ""
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
                name: name,
                brand: brand,
                image: image,
                description: description,
                linkdetail: linkdetail,
                level: level,
                sdktype:sdktype,
                companyid: companyid
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
    updateProductV2: async (req, res)=>{

    
        const { id,  name, image, description, linkdetail, level, sdktype, companyid = "", brand } = req.body
        console.log(req.body);
       
        if (
            name == null ||
            name == "" ||
            image == null ||
            image == "" ||
            description == null ||
            description == "" ||
            linkdetail == null ||
            linkdetail == "" ||
            level == null ||
            level == "" ||
            sdktype == null ||
            sdktype == "" ||
            companyid == null ||
            companyid == ""
        ) {
            res.json({
                status: 201,
                message: "Miss params",
                data: null,
            })
            return
        }

        try {
            name, image, description, linkdetail, level, sdktype, companyid 
            const date = new Date()
            const body =
            {
                name: name,
                image: image,
                description: description,
                linkdetail: linkdetail,
                level: level,
                sdktype:sdktype,
                brand: brand,
                companyid: companyid
            };
        

            await Sku.updateOne({ _id: ObjectId(id) }, body)
      
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

    delete: async (req, res)=>{

    
        const { id } = req.body
         console.log(id);
       
    

        try {

      
    await Sku.deleteOne({ _id: ObjectId(id) });
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
    }
 
 


}

module.exports = ProductSuggest