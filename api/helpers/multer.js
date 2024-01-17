const multer = require('multer')

const storageBrand = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image_brand')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const uploadBrand = multer({ storage: storageBrand });


const storageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image_product')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const uploadProduct = multer({ storage: storageProduct });

const storageCategory = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image_category')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const uploadCategory = multer({ storage: storageCategory });


const storageCompany = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/logo_company')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const uploadCompany = multer({ storage: storageCompany });

const storageDeal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image_deal')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname)
    }
})

const uploadDeal = multer({ storage: storageDeal });

module.exports = { 
    uploadBrand,
    uploadProduct,
    uploadCategory,
    uploadCompany,
    uploadDeal
}