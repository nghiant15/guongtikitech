const ObjectId = require('mongodb').ObjectId
const CountOrder = require('../../models/Hardward/CountOrderModel')
const Product = require('../../models/Hardward/ProductModels')
const Response = require('../../helpers/Response');

module.exports = {
    //User Table
    getListCountOrder: async (req, res) => {
        try {
            var dataCountOrder = await CountOrder.aggregate([
                {
                    $group: {
                        _id: '$product_id',
                        detail: { $first: '$$ROOT' },
                        count: {
                            $sum: 1,
                        },
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: { $mergeObjects: [{ count: '$count' }, '$detail'] },
                    },
                }])

            const dataProduct = await Product.find({ isdelete: false })
            
            let pro = [];
            dataCountOrder.map(val => {
                let data = dataProduct.filter(v => String(v._id) == String(val.product_id));
                if (data.length > 0) {
                    pro.push(Object.assign(val, { product_data: data[0] }));
                }
            })

            res.send(Response(200, "Thành công", dataCountOrder, true));

        } catch (err) {
            res.send(Response(202, "Dữ liệu đã tồn tại: " + JSON.stringify(err.keyValue), err, false));
        }
    }
}