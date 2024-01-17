const ObjectId = require("mongodb").ObjectId;
const Brand = require("../../models/AdminApp/BrandModel");
const Type = require("../../models/AdminApp/TypeModel");
const Sku = require("../../models/AdminApp/SkuModel");
const Color = require("../../models/AdminApp/ColorModel");
const SubType = require("../../models/AdminApp/SubTypeModel");

module.exports = {
  getListBrand: async (req, res) => {
    try {
      const { limit } = req.query;

      if (limit == null) {
        const cursor = await Brand.find();

        res.json({
          status: 200,
          message: "Thành công",
          data: cursor,
        });
      } else {
        const cursor = await Brand.find().limit(Number(limit));

        res.json({
          status: 200,
          message: "Thành công",
          data: cursor,
        });
      }
    } catch (err) {
      res.json({
        status: 201,
        message: err.message,
        data: null,
      });
    }
  },
  getSkuMakeup: async (req, res) => {
    try {
      const { brand_id } = req.query;

      const makeupType = await Type.aggregate([
        {
          $lookup: {
            from: "tb_sub_type_makeups",
            localField: "_id",
            foreignField: "type_id",
            as: "sub_type_makeup",
          },
        },
      ]);

      const sku = await Sku.find({ brand_id: ObjectId(brand_id) });

      const color = await Color.find();

      let pro = [];
      sku.map((val) => {
        let hex = color.filter(
          (v) =>
            String(v.product_id) == String(val._id) && String(v.makeup_id) != ""
        );
        if (hex.length > 0) {
          // val.color = hex;
          pro.push(Object.assign(val.toObject(), { color: hex }));
        }
      });

      let result = [];
      makeupType.map((val) => {
        let sub_type = [];
        val.sub_type_makeup.map((sub) => {
          let product = pro.filter(
            (sku) => String(sku.type_id) == String(sub._id)
          );
          if (product.length > 0) {
            sub.product = product;
            sub_type.push(sub);
          }
        });
        if (sub_type.length > 0) {
          val.sub_type_makeup = sub_type;
          result.push(val);
        }
      });

      res.json({
        status: result.length > 0 ? 200 : 201,
        message: result.length > 0 ? "Thành công" : "There is no sku list",
        data: result.length > 0 ? result : null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getSku: async (req, res) => {
    try {
      const { brand_id } = req.query;

      const subType = await SubType.find();

      const sku = await Sku.find({ brand_id: ObjectId(brand_id) });

      const color = await Color.find();

      let pro = [];
      sku.map((val) => {
        let hex = color.filter(
          (v) =>
            String(v.product_id) == String(val._id) && String(v.makeup_id) != ""
        );
        if (hex.length > 0) {
          pro.push(Object.assign(val.toObject(), { color: hex }));
        }
      });

      let result = [];
      subType.map((val) => {
        let product = pro.filter(
          (sku) => String(sku.type_id) == String(val._id)
        );
        if (product.length > 0) {
          result.push(Object.assign(val.toObject(), { product: product }));
        }
      });

      res.json({
        status: result.length > 0 ? 200 : 201,
        message: result.length > 0 ? "Thành công" : "There is no sku list",
        data: result.length > 0 ? result : null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getBrand: async (req, res) => {

    const { company_id } = req.query
    console.log(company_id)
    const brand = await Brand.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id});

    res.json({
      status: 200,
      message: "Thành công",
      data: brand,
    });
  },
  getType: async (req, res) => {
    const { company_id } = req.query
    const type = await SubType.find({company_id: company_id == undefined || company_id == null || company_id == "null" ? "" : company_id});
    res.json({
      status: 200,
      message: "Thành công",
      data: type,
    });
  },
  getProduct: async (req, res) => {
    const brand = await Brand.find();
    const type = await SubType.find();
    const sku = await Sku.find();

    let result = [];

    sku.map((val) => {
      let arr = val;
      const b = brand.filter(
        (v) => String(v["_id"]) == String(val["brand_id"])
      );
      const t = type.filter((v) => String(v["_id"]) == String(val["type_id"]));
      result.push(
        Object.assign(val.toObject(), {
          type: t[0].vi || t[0].name,
          brand: b[0].name,
        })
      );
    });

    res.json({
      status: 200,
      message: "Thành công",
      data: result,
    });
  },
  getColor: async (req, res) => {
    const sku = await Sku.find();
    const color = await Color.find();

    let result = [];

    color.map((val) => {
      const s = sku.filter((v) => String(v["_id"]) == String(val.product_id));
      result.push(Object.assign(val.toObject(), { product: s[0].name }));
    });

    res.json({
      status: 200,
      message: "Thành công",
      data: result,
    });
  },
  addBrand: async (req, res) => {
    const { name, image, company_id = "" } = req.body;
    if (
      name == null ||
      name.trim() == "" ||
      image == null ||
      image.trim() == ""
    ) {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      const brand = new Brand({
        name: name,
        image: image,
        company_id: company_id
      });

      await brand.save();

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  addType: async (req, res) => {
    const { image, vi, company_id = "" } = req.body;
    if (vi == null || vi.trim() == "" || image == null || image.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      const type = new SubType({
        vi: vi,
        image: image,
        name: vi,
        company_id: company_id
      });

      await type.save();

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  addProduct: async (req, res) => {
    const { type_id, brand_id, name, href, image } = req.body;
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
      image.trim() == ""
    ) {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }
    try {
      const product = new Sku({
        type_id: ObjectId(type_id),
        brand_id: ObjectId(brand_id),
        name: name,
        href: href,
        image: image,
      });

      await product.save();

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  addColor: async (req, res) => {
    const { product_id, hex, makeup_id, alpha, ver } = req.body;
    if (
      product_id == null ||
      product_id.trim() == "" ||
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
      const color = new Color({
        product_id: ObjectId(product_id),
        hex: hex,
        makeup_id: makeup_id,
        alpha: Number(alpha),
        ver: ver == null || ver == "" ? "v4" : "v3"
      });

      await color.save();

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  updateBrand: async (req, res) => {
    const { id, name, image } = req.body;
    if (
      id == null ||
      id.trim() == "" ||
      name == null ||
      name.trim() == "" ||
      image == null ||
      image.trim() == ""
    ) {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }
    try {
      const update = {
        name: name,
        image: image,
      };

      await Brand.updateOne({ _id: ObjectId(id) }, update);

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  updateType: async (req, res) => {
    const { id, vi, image } = req.body;
    if (
      id == null ||
      id.trim() == "" ||
      vi == null ||
      vi.trim() == "" ||
      image == null ||
      image.trim() == ""
    ) {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }
    try {
      const update = {
        vi: vi,
        image: image,
        name: vi,
      };

      await SubType.updateOne({ _id: ObjectId(id) }, update);

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  updateColor: async (req, res) => {
    const { id, product_id, hex, makeup_id, alpha, ver } = req.body;
    if (
      id == null ||
      id.trim() == "" ||
      product_id == null ||
      product_id.trim() == "" ||
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
      const update = {
        product_id: ObjectId(product_id),
        hex: hex,
        makeup_id: makeup_id,
        alpha: Number(alpha),
        // ver: ver == null || ver == "" ? "v4" : "v3"
      };

      await Color.updateOne({ _id: ObjectId(id) }, update);

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  updateProduct: async (req, res) => {
    const { id, type_id, brand_id, name, href, image } = req.body;
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
      image.trim() == ""
    ) {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }
    try {
      const update = {
        type_id: ObjectId(type_id),
        brand_id: ObjectId(brand_id),
        name: name,
        href: href,
        image: image,
      };

      await Sku.updateOne({ _id: ObjectId(id) }, update);

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  deleteColor: async (req, res) => {
    const { id } = req.body;
    if (id == null || id.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      await Color.deleteOne({ _id: ObjectId(id) });

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  deleteType: async (req, res) => {
    const { id } = req.body;
    if (id == null || id.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      const p = await Sku.find({ type_id: ObjectId(id) });

      if (p.length > 0) {
        res.json({
          status: 201,
          message:
            "Please remove all products with type {name} before removing {name}",
          data: null,
        });
        return;
      }

      await SubType.deleteOne({ _id: ObjectId(id) });

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.body;
    if (id == null || id.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      // const p = await Color.find({ product_id: ObjectId(id) });

      // if (p.length > 0) {
      //   res.json({
      //     status: 201,
      //     message:
      //       "Please remove all color with product {name} before removing {name}",
      //     data: null,
      //   });
      //   return;
      // }

      await Sku.deleteOne({ _id: ObjectId(id) });

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  deleteBrand: async (req, res) => {
    const { id } = req.body;
    if (id == null || id.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    try {
      const p = await Sku.find({ brand_id: ObjectId(id) });

      if (p.length > 0) {
        res.json({
          status: 201,
          message:
            "Please remove all products with brand {name} before removing {name}",
          data: null,
        });
        return;
      }

      await Brand.deleteOne({ _id: ObjectId(id) });

      res.json({
        status: 200,
        message: "Thành công",
        data: null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getProAllBrand: async (req, res) => {
    try {
      const { limit } = req.query;

      const makeupType = await Type.aggregate([
        {
          $lookup: {
            from: "tb_sub_type_makeups",
            localField: "_id",
            foreignField: "type_id",
            as: "sub_type_makeup",
          },
        },
      ]);

      const sku = await Sku.find();

      const color = await Color.find();

      let pro = [];
      sku.map((val) => {
        let hex = color.filter(
          (v) =>
            String(v.product_id) == String(val._id) && String(v.makeup_id) != ""
        );
        if (hex.length > 0) {
          // val.color = hex;
          pro.push(Object.assign(val.toObject(), { color: hex }));
        }
      });

      let result = [];
      makeupType.map((val) => {
        let sub_type = [];
        val.sub_type_makeup.map((sub) => {
          let product = pro.filter(
            (sku) => String(sku.type_id) == String(sub._id)
          );
          if (product.length > 0 && sub["_id"] != "5fca7bb84baf79302ccfa681") {
            let p = product;
            if (limit) {
              let data = [];
              product.map((val) => {
                if (data.length < limit) {
                  data.push(val);
                }
              });
              p = data;
            }
            sub.product = p;
            sub_type.push(sub);
          }
        });
        if (sub_type.length > 0) {
          val.sub_type_makeup = sub_type;
          result.push(val);
        }
      });

      res.json({
        status: result.length > 0 ? 200 : 201,
        message: result.length > 0 ? "Thành công" : "There is no sku list",
        data: result.length > 0 ? result : null,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getHair: async (req, res) => {
    try {
      const sku = await Sku.find();

      const color = await Color.find();

      let hair = [];
      sku.map((val) => {
        if (val.type_id == "5fca7bb84baf79302ccfa681") {
          hair.push(val);
        }
      });

      let result = [];

      hair.map((val) => {
        const c = color.filter(
          (state) => String(state.product_id) == String(val["_id"])
        );

        if (c.length > 0) {
          result.push(Object.assign(val.toObject(), { color: c }));
        }
      });

      res.json({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getAllColor: async (req, res) => {
    try {
      const makeupType = await Type.aggregate([
        {
          $lookup: {
            from: "tb_sub_type_makeups",
            localField: "_id",
            foreignField: "type_id",
            as: "sub_type_makeup",
          },
        },
        { $sort: { index: 1 } },
      ]);

      const sku = await Sku.find();

      const color = await Color.find();

      let pro = [];
      sku.map((val) => {
        let hex = color.filter(
          (v) =>
            String(v.product_id) == String(val._id) && String(v.makeup_id) != ""
        );
        if (hex.length > 0) {
          // val.color = hex;
          pro.push(Object.assign(val.toObject(), { color: hex }));
        }
      });

      let result = [];
      makeupType.map((val) => {
        let sub_type = [];
        let proColor = [];
        val.sub_type_makeup.map((sub) => {
          let product = pro.filter(
            (sku) => String(sku.type_id) == String(sub._id)
          );
          if (product.length > 0 && sub["_id"] != "5fca7bb84baf79302ccfa681") {
            sub.product = product;
            sub_type.push(sub);
            product.map((val) => {
              proColor.push(val);
            });
          }
        });
        if (proColor.length > 0) {
          val.sub_type_makeup = sub_type;
          val["_id"] == "5fca29e7a50a0d24de870f88" &&
            delete val.sub_type_makeup;
          val["_id"] == "5fca29e7a50a0d24de870f88" && (val.product = proColor);
          // val.product = proColor;
          result.push(val);
        }
      });

      // result.sort((a, b)=>{
      //     return a.vi > v.vi
      // })

      res.json({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      // console.log(err)
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getNewSku: async (req, res)=>{
    try {
      const makeupType = await Type.aggregate([
        {
          $lookup: {
            from: "tb_sub_type_makeups",
            localField: "_id",
            foreignField: "type_id",
            as: "sub_type_makeup",
          },
        },
        { $sort: { index: 1 } },
      ]);

      const sku = await Sku.find();

      const color = await Color.find();

      let pro = [];
      sku.map((val) => {
        let hex = color.filter(
          (v) =>
            String(v.product_id) == String(val._id) && String(v.makeup_id) != ""
        );
        if (hex.length > 0) {
          pro.push(Object.assign(val.toObject(), { color: hex }));
        }
      });

      let result = [];
      makeupType.map((val) => {
        let sub_type = [];
        let proColor = [];
        val.sub_type_makeup.map((sub) => {
          let product = pro.filter(
            (sku) => String(sku.type_id) == String(sub._id)
          );
          if (product.length > 0 && sub["_id"] != "5fca7bb84baf79302ccfa681") {
            sub.product = product;
            sub_type.push(sub);
            product.map((val) => {
              if(val.color[0].ver == "v4"){
                proColor.push(val);
              }
            });
          }
        });
        if (proColor.length > 0 && val["_id"] == "5fca29e7a50a0d24de870f88") {
          val.sub_type_makeup = sub_type;
          val["_id"] == "5fca29e7a50a0d24de870f88" &&
            delete val.sub_type_makeup;
          val["_id"] == "5fca29e7a50a0d24de870f88" && (val.product = proColor);
          result.push(val);
        }
      });

      res.json({
        status: 200,
        message: "success",
        data: result,
      });
    } catch (err) {
      console.log(err)
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
  getNewHair: async (req, res) => {
    try {
      const sku = await Sku.find();

      const color = await Color.find();

      let hair = [];
      sku.map((val) => {
        if (val.type_id == "5fca7bb84baf79302ccfa681") {
          hair.push(val);
        }
      });

      let result = [];

      hair.map((val) => {
        const c = color.filter(
          (state) => String(state.product_id) == String(val["_id"])
        );

        if (c.length > 0) {
          result.push(Object.assign(val.toObject(), { color: c }));
        }
      });
      let r = []
      for(let i = 5; i < result.length; i++){
        r.push(result[i])
      }

      res.json({
        status: 200,
        message: r.length,
        data: r,
      });
    } catch (err) {
      res.json({
        status: 201,
        message: err,
        data: null,
      });
    }
  },
};
