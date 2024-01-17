const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const router = express.Router();
const Item = require("../models/ItemModel");

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    let opts = {};
    if (req.query.level) {
      opts["$or"] = [
        { level: new RegExp(req.query.level.replace(/\W/g, "\\$&"), "i") },
      ];
    } else if (req.query.key) {
      opts["$or"] = [
        { name: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
        { title: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
        { description: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
        { linkdetail: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
        { companyid: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
        { sdktype: new RegExp(req.query.key.replace(/\W/g, "\\$&"), "i") },
      ];
    }
    const data = await Item.find(opts)
      .limit(Number(limit))
      .skip(Number(page - 1) * Number(limit));

    const totalItems = await Item.countDocuments(opts);
    // return {
    //   statusCode: 200,
    //   data,
    //   page,
    //   limit,
    //   totalItems,
    //   totalPages: Math.ceil(totalItems / limit),
    // };
    res.json({
      statusCode: 200,
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/itemByIds", async (req, res) => {
  try {
    let level = req.query.level;
    let sdktype = req.query.sdktype;
    const item = await Item.find(
      { level: level, sdktype: sdktype },
      { __v: 0 }
    );
    res.json(item);
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/deleteItem", async (req, res) => {
  try {
    const { id } = req.body;
    if (id == null || id.trim() == "") {
      res.json({
        status: 201,
        message: "Miss params",
        data: null,
      });
      return;
    }

    await Item.deleteOne({ _id: ObjectId(id) });

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
});

router.post("/", async (req, res) => {
  const item = new Item({
    name: req.body.name,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    linkdetail: req.body.linkdetail,
    level: req.body.level,
    sdktype: req.body.sdktype,
    companyid: req.body.companyid !== undefined ? req.body.companyid : "",
  });

  try {
    const a1 = await item.save();
    res.json(a1);
  } catch (err) {
    // console.log("err", err);
    res.json({
      status: 201,
      message: err.message,
      data: null,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    (item.name = req.body.name !== undefined ? req.body.name : item.name),
      (item.image = req.body.image !== undefined ? req.body.image : item.image),
      (item.title = req.body.title !== undefined ? req.body.title : item.title),
      (item.description =
        req.body.description !== undefined
          ? req.body.description
          : item.description),
      (item.linkdetail =
        req.body.linkdetail !== undefined
          ? req.body.linkdetail
          : item.linkdetail),
      (item.level = req.body.level !== undefined ? req.body.level : item.level),
      (item.sdktype =
        req.body.sdktype !== undefined ? req.body.sdktype : item.sdktype);
    item.companyid =
      req.body.companyid !== undefined ? req.body.companyid : item.companyid;
    const a1 = await item.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

router.post("/multiItem", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10000;
    let opts = {};
    if (req.body.data) {
      let queryData = [];
      // // console.log('data', typeof req.body.data, JSON.parse(req.body.data))
      let dataInput = req.body.data;
      dataInput.forEach((element) =>
        queryData.push({
          $and: [
            { level: element.level + "" },
            { sdktype: element.sdktype + "" },
          ],
        })
      );
      // // console.log("queryData", queryData);
      opts["$or"] = queryData;
      // // console.log("queryOption", opts["$or"]);
    }
    const data = await Item.find(opts)
      .limit(Number(limit))
      .skip(Number(page - 1) * Number(limit));

    const totalItems = await Item.countDocuments(opts);
    res.json({
      statusCode: 200,
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    // console.log("err", err);
    res.json({
      status: 201,
      message: err.message,
      data: null,
    });
  }
});

module.exports = router;
