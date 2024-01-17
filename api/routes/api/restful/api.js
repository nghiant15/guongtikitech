var { auth, authAdmin, auth, authEndUser } = require('../../../helpers/auth');
var { uploadBrand, uploadProduct, uploadCategory, uploadCompany, uploadDeal } = require('../../../helpers/multer');

module.exports = function (app) {

    //UserModel
    const UserController = require("../../../controllers/UserController");
    app.route("/api/list-user").post(UserController.getListUser);
    app.route("/api/add-user").post(UserController.addUser);
    app.route("/api/update-user").post(UserController.updateUser);
    app.route("/api/delete-user").delete(UserController.deleteUser);
    app.route("/api/verify-mail").get(UserController.verifyEmail);
    app.route("/api/reset-password").get(UserController.resetPassword);
    app.route("/api/update-status").get(UserController.updateStatus);
    app.route("/api/verifyUser").post(UserController.VerifyUser);
    app.route("/api/login_admin").post(UserController.LoginAdmin);
    app.route("/api/get-shop").post(UserController.getListShopManager);
    app.route("/api/get-shop").get(UserController.getListShopManager2);
    app.route("/api/get-sale").post(auth, UserController.getListSale);
    app.route("/api/get-data-sale").post(UserController.getSaleData);
    app.route("/api/get-seed").post(UserController.getSeederData);
    app.route("/api/get-name-sale").post(UserController.getSale_name);
    app.route("/api/get-user-byID").post(auth, UserController.getUserByID);

    const DealController = require("../../../controllers/GianHang/DealController");
    app.route("/api/list_deal").post(DealController.getListDeal);
    app.route("/api/get_deal_by_slug").post(DealController.getDealBySlug);
    app.route("/api/get_product_of_deal").post(DealController.getProductOfDeal);
    app.route("/api/add_deal").post(DealController.addDeal);
    app.route("/api/update_deal").post(DealController.updateDeal);
    app.route("/api/delete_deal").post(DealController.deleteDeal);
    app.route("/api/upload_deal").post(uploadDeal.single('image'), DealController.addImage);

    const EndUserController = require("../../../controllers/GianHang/EndUserController");
    app.route("/api/login_customer").post(EndUserController.LoginUser);
    app.route("/api/get_user_by_id").post(auth, EndUserController.getListUserById);
    app.route("/api/add_customer").post(EndUserController.addUser);
    app.route("/api/reset_password").post(authEndUser, EndUserController.resetPassword);
    app.route("/api/update_user_by_id").post(authEndUser, EndUserController.updateUserByID);

    const OrderStoreController = require("../../../controllers/GianHang/OrderController");
    app.route("/api/list_order").post(OrderStoreController.getListOrder);
    app.route("/api/get_detail_transport").get(OrderStoreController.getTransportData);
    app.route("/api/get_info_order").get(OrderStoreController.getInfoOrder);
    app.route("/api/print_order").get(OrderStoreController.printOrder);
    app.route("/api/list_order_detail").post(OrderStoreController.getListDetail);
    app.route("/api/list_order_by_user").post(authEndUser, OrderStoreController.getListOrderByUser);
    app.route("/api/add_order").post(authEndUser, OrderStoreController.addOrder);
    app.route("/api/manager_order").post(authEndUser, OrderStoreController.ManagerOrder);
    app.route("/api/update_status_order").post(authEndUser, OrderStoreController.updateStatus);
    app.route("/api/manager_order_by_id").post(authEndUser, OrderStoreController.ManagerOrderByID);

    //UserModel
    const CustomerController = require("../../../controllers/CustomerController");
    app.route("/api/list-customer").post(auth, CustomerController.getListCustomer);
    app.route("/api/list-customer-v2").post(auth, CustomerController.getListCustomer_V2);
    app.route("/api/list-customer-v3").get( CustomerController.getListCustomer_V3);
    app.route("/api/list-detail-customer").post( CustomerController.getListDetailAppear);
    app.route("/api/login-customer").post(CustomerController.loginCustomer);
    app.route("/api/add-customer").post(CustomerController.addCustomer);
    app.route("/api/get-user-by-month-admin").post(CustomerController.getCustomerByMonth_Admin);
    app.route("/api/get-user-sale-by-month").post(CustomerController.getCustomerByMonth);
    
    app.route("/api/company-chart").post(CustomerController.getChart_Company);
    app.route("/api/sale-chart").post(CustomerController.getChart_Sale);
    app.route("/api/admin-chart").post(CustomerController.getChart_Admin);

    app.route("/api/get-user-of-sale-by-month").post(CustomerController.saleGetCustomer_by_month);
    app.route("/api/calculator-coefficient-user").post(CustomerController.cal_hesoUser);
    app.route("/api/calculator-coefficient-user-per-sale").post(CustomerController.cal_hesoUser_per_sale);
    app.route("/api/calculator-all-user-company").post(CustomerController.getListCustomer_Heso);
    app.route("/api/calculator-all-user-of-sale").post(CustomerController.getListCustomer_Sale_Heso);

    //UserModel
    const CheckOrderController = require("../../../controllers/CheckOrderController");
    app.route("/api/list-order-checked").post(auth, CheckOrderController.getOrder);
    app.route("/api/list-order").post(CheckOrderController.getListAllOrder);
    app.route("/api/sum-order-by-month").post(CheckOrderController.sumOrderByMonth);
    app.route("/api/sum-product-by-month").post(CheckOrderController.sumProductByMonth);
    app.route("/api/sum-product-by-day").post(CheckOrderController.sumProductByDay);
    app.route("/api/statistical-order-by-month").post(CheckOrderController.getOrderSaleByMonth);
    app.route("/api/statistical-customer-by-month").post(CheckOrderController.getCustomerSaleByMonth);
    app.route("/api/update-order").post(CheckOrderController.updateOrder);
    app.route("/api/list-product-checked").post(auth, CheckOrderController.getOrderProduct);
    app.route("/api/check-exist-customer").post(CheckOrderController.checkExitsCustomerByPhone);
    app.route("/api/add-order-checked").post(CheckOrderController.addOrder);
    app.route("/api/add-product-checked").post(CheckOrderController.addOrderProduct);

    //CompanyModel
    const CompanyController = require("../../../controllers/CompanyController");
    app.route("/api/list-company").post(CompanyController.getListCompany);
    app.route("/api/add-company").put(CompanyController.addCompany);
    app.route("/api/upload-company").post(uploadCompany.single('image') , CompanyController.addImage);
    app.route("/api/update-company").post(CompanyController.updateCompany);
    app.route("/api/delete-company").delete(CompanyController.deleteCompany);
    app.route("/api/get-data-company").post(CompanyController.getNameCompany);

    //KeyModel
    const KeyController = require("../../../controllers/KeyController");
    app.route("/api/list-key").post(auth, KeyController.getListKey);
    app.route("/api/add-key").put(KeyController.addKey);
    app.route("/api/update-key").post(KeyController.updateKey);
    app.route("/api/delete-key").delete(KeyController.deleteKey);

    //KeyOrderModel
    const KeyOrderController = require("../../../controllers/KeyOrderController");
    app.route("/api/list-keyorder").get(KeyOrderController.getListKeyOrder);
    app.route("/api/add-keyorder").put(KeyOrderController.addKeyOrder);
    app.route("/api/update-keyorder").post(KeyOrderController.updateKeyOrder);
    app.route("/api/delete-keyorder").delete(KeyOrderController.deleteKeyOrder);

    //PackageSaleLogModel
    const PackageSaleLogController = require("../../../controllers/PackageSaleLogController");
    app.route("/api/list-salelog").get(PackageSaleLogController.getListPackageSaleLog);
    app.route("/api/add-salelog").put(PackageSaleLogController.addPackageSaleLog);
    app.route("/api/update-salelog").post(PackageSaleLogController.updatePackageSaleLog);
    app.route("/api/delete-salelog").delete(PackageSaleLogController.deletePackageSaleLog);

    //PackageSaleModel
    const PackageSaleController = require("../../../controllers/PackageSaleController");
    app.route("/api/list-sale").get(PackageSaleController.getListPackageSale);
    app.route("/api/add-sale").put(PackageSaleController.addPackageSale);
    app.route("/api/update-sale").post(PackageSaleController.updatePackageSale);
    app.route("/api/delete-sale").delete(PackageSaleController.deletePackageSale);

    //RoleModel
    const RoleController = require("../../../controllers/RoleController");
    app.route("/api/list-role").get(auth, RoleController.getListRole);
    app.route("/api/add-role").put(RoleController.addRole);
    app.route("/api/update-role").post(RoleController.updateRole);
    app.route("/api/delete-role").delete(RoleController.deleteRole);

    //TypeKeyModel
    const TypeKeyController = require("../../../controllers/TypeKeyController");
    app.route("/api/list-typekey").get(TypeKeyController.getListTypeKey);
    app.route("/api/add-typekey").put(TypeKeyController.addTypeKey);
    app.route("/api/update-typekey").post(TypeKeyController.updateTypeKey);
    app.route("/api/delete-typekey").delete(TypeKeyController.deleteTypeKey);

    //LinkModel
    const LinkController = require("../../../controllers/LinkController");
    app.route("/api/list-link").post(LinkController.getListLink);
    app.route("/api/add-link").put(LinkController.addLink);
    app.route("/api/update-link").post(auth, LinkController.updateLink);
    app.route("/api/delete-link").delete(LinkController.deleteLink);
    app.route("/api/link-by-id").post(auth, LinkController.getListLinkBy_ID);

    //OrderModel
    const OrderController = require("../../../controllers/OrderController");
    app.route("/api/list-order-hardward").post(OrderController.getOrder);
    app.route("/api/list-order-detail").post(auth, OrderController.getDataOrderDetail);
    app.route("/api/update-status-hardware").post(OrderController.updateStatusHardware);
    app.route("/api/add-order").put(auth, OrderController.addOrder);
    app.route("/api/update-status-order").post(OrderController.updateStatus);
    app.route("/api/check-status-hardware-of-company").post(OrderController.checkStatusHardWareOfCompany);
    app.route("/api/get-info-divice").post(OrderController.getInfoDivice);
    app.route("/api/check-status-hardware").post(OrderController.checkStatusHardWare);

    //Check Out Model
    const CustomerCheckOut = require("../../../controllers/CustomerCheckOutController");
    app.route("/api/list-checkout").post(CustomerCheckOut.getCheckOut);
    app.route("/api/get-list-hardward-by-check-out").post(auth, CustomerCheckOut.getDataHardWareByCheckOut);
    app.route("/api/update-status-hardware").post(CustomerCheckOut.updateStatus);

    //OrderModel
    const OrderDetailController = require("../../../controllers/OrderDetailController");
    app.route("/api/list-orderdetail").post(OrderDetailController.getOrder);
    app.route("/api/get-infomation-by-key").post(OrderDetailController.getDataByKey);

    //HardWare
    const HardWareController = require("../../../controllers/HardWardController");
    app.route("/api/list-hardware").post(auth, HardWareController.getListHardWare);
    app.route("/api/add-hardware").put(HardWareController.addHardWare);
    app.route("/api/update-hardware").post(HardWareController.updateHardWare);
    app.route("/api/delete-hardware").delete(HardWareController.deleteHardWare);

    //Từ phần này trở đi thì là merge từ bên server makeup qua

    //Transaction Model
    const TransactionController = require("../../../controllers/TransactionController");
    app.route("/api/list-transaction").post(TransactionController.getTransaction);
    app.route("/api/add-transaction").post(TransactionController.addTransaction);

    //Showlos
    const Showlos = require("../../../controllers/ShowlosController");
    app.route("/api/showlost").get(Showlos.showlost);

    const UserMakeup = require("../../../controllers/UserMakeupController");
    app.route("/api/get-info").post(UserMakeup.getInfo);
    app.route("/api/register-device").post(UserMakeup.registerDevice);

    const CategoryController = require("../../../controllers/GianHang/CategoryController");
    app.route("/api/list-category").post(auth, CategoryController.listCategory);
    app.route("/api/add-category").post(auth, CategoryController.addCategory);
    app.route("/api/update-category").post(auth, CategoryController.updateCategory);
    app.route("/api/delete-category").post(CategoryController.deleteCategory);
    app.route("/api/upload-category").post(uploadCategory.single('image') , CategoryController.addImage);

    const BrandHardware = require("../../../controllers/GianHang/BrandController");
    app.route("/api/list-brand-hardward").post(auth, BrandHardware.listBrand);
    app.route("/api/add-brand-hardward").post(auth, BrandHardware.addBrand);
    app.route("/api/update-brand-hardward").post(auth, BrandHardware.updateBrand);
    app.route("/api/delete-brand-hardward").post(BrandHardware.deleteBrand);
    app.route("/api/upload-image-brand").post(uploadBrand.single('image') , BrandHardware.addImage);

    const ProductHardware = require("../../../controllers/GianHang/ProductController");
    app.route("/api/list-product-hardward").post(auth, ProductHardware.listProduct);
    app.route("/api/list-product-by-company").post(ProductHardware.listProductByCompany);
    app.route("/api/search-product").get(ProductHardware.searchData);
    app.route("/api/add-product-hardward").post(auth, ProductHardware.addProduct);
    app.route("/api/update-product-hardward").post(auth, ProductHardware.updateProduct);
    app.route("/api/delete-product-hardward").post(ProductHardware.deleteProduct);
    app.route("/api/get-info-by-code").post(ProductHardware.getInfoByCode);
    app.route("/api/info-product-by-id").post(ProductHardware.getInfoByID);
    app.route("/api/upload-image-product").post(uploadProduct.single('image') , ProductHardware.addImage);

    const OrderAddressController = require("../../../controllers/GianHang/OrderAddressController");
    app.route("/api/get-address-by-id").post(OrderAddressController.getListOrderAddressById);
    app.route("/api/get-address-default").post(authEndUser, OrderAddressController.getDefaultOrderAddress);
    app.route("/api/update-default-address").post(authEndUser, OrderAddressController.updateDefaultOrderAddress);
    app.route("/api/list-order-address").post(authEndUser, OrderAddressController.getListOrderAddress);
    app.route("/api/add-order-address").post(authEndUser, OrderAddressController.addOrderAddress);
    app.route("/api/update-order-address").post(OrderAddressController.updateOrderAddress);
    app.route("/api/delete-order-address").post(OrderAddressController.deleteOrderAddress);

    const ConfigSystemController = require("../../../controllers/HardWare/ConfigSystemController");
    app.route("/api/list-config").post(ConfigSystemController.listConfigSystem);
    app.route("/api/config-by-id").post(ConfigSystemController.listConfigSystem_By_ID);
    app.route("/api/update-config").post(ConfigSystemController.updateConfigSystem);

    const SEOInfoController = require("../../../controllers/GianHang/SEOInfoController");
    app.route("/api/get_seo_info").post(SEOInfoController.getListSEOInfo);
    app.route("/api/get_seo_info_by_product").post(SEOInfoController.getSEOInfoByProduct);
    app.route("/api/add_seo_info").post(SEOInfoController.addSEOInfo);
    app.route("/api/update_seo_info").post(SEOInfoController.updateSEOInfo);
    app.route("/api/delete_seo_info").post(SEOInfoController.deleteSEOInfo);

    const HistorySkinController = require("../../../controllers/HardWare/HistorySkinController");
    app.route("/api/list-history").post(auth, HistorySkinController.getListHistorySkin);
    app.route("/api/list-history-by-sale").post(HistorySkinController.getListHistorySkinBySale);
    app.route("/api/list-history-by-phone").post(HistorySkinController.getListHistorySkinByPhone);
    app.route("/api/add-history").post(HistorySkinController.addHistorySkin);
    app.route("/api/get-detail-history-skin").post(HistorySkinController.getHistorybYId);
    

    //Admin app
    const BrandControllerApp = require("../../../controllers/AdminApp/BrandController");
    app.route("/brands").get(BrandControllerApp.getBrand);
    app.route("/add-brand").post(BrandControllerApp.addBrand);
    app.route("/update-brand").post(BrandControllerApp.updateBrand);
    app.route("/delete-brand").post(BrandControllerApp.deleteBrand);

    app.route("/types").get(BrandControllerApp.getType);
    app.route("/add-type").post(BrandControllerApp.addType);
    app.route("/update-type").post(BrandControllerApp.updateType);
    app.route("/delete-type").post(BrandControllerApp.deleteType);

    app.route("/delete-color").post(BrandControllerApp.deleteColor);
    app.route("/delete-product").post(BrandControllerApp.deleteProduct);
    app.route("/delete-brand").post(BrandControllerApp.deleteBrand);

    const ColorController = require("../../../controllers/AdminApp/ColorController");
    app.route("/v2/color").get(ColorController.getAllColor);
    app.route("/v2/add-color").post(ColorController.addColor);
    app.route("/v2/update-color").post(ColorController.updateColor);

    app.route("/v2/color-hair").get(ColorController.getAllColorHair);

    const ProductController = require("../../../controllers/AdminApp/ProductController");
    app.route("/v2/product").get(ProductController.getAllProduct);
    app.route("/v2/add-product").post(ProductController.addProduct);
    app.route("/v2/update-product").post(ProductController.updateProduct);

    app.route("/v2/hair").get(ProductController.getAllHair);


    const ProductSuggessController = require("../../../controllers/AdminApp/ProductSuggestController");
    app.route("/productSuggest/add").post(ProductSuggessController.addProduct);
    app.route("/productSuggest/getAll").get(ProductSuggessController.getAllProduct);
    app.route("/productSuggest/update").post(ProductSuggessController.updateProductV2);
    app.route("/productSuggest/delete").post(ProductSuggessController.delete);
    app.route("/productSuggest/getAllProduct").post(ProductSuggessController.getAllProductSugest);
   
};
