import React from 'react';

const Dashboard = React.lazy(() => import('./views/DashBoard/Dashboard'));
const TableUser = React.lazy(() => import('./views/base/tables/TableUser'));
const TableCompany = React.lazy(() => import('./views/base/tables/Company'));
const TableKey = React.lazy(() => import('./views/base/tables/Key'));
const TableKeyOrder = React.lazy(() => import('./views/base/tables/KeyOrder'));
const TablePakageSale = React.lazy(() => import('./views/base/tables/PakageSale'));
const TablePakageSaleLog = React.lazy(() => import('./views/base/tables/PakageSaleLog'));
const TableRole = React.lazy(() => import('./views/base/tables/Role'));
const TableTypeKey = React.lazy(() => import('./views/base/tables/TypeKey'));
const TableLink = React.lazy(() => import('./views/base/tables/Link'));
const HistorySkinUser = React.lazy(() => import('./views/base/tables/HistorySkinUser'));
const ListShopManager = React.lazy(() => import('./views/base/tables/ListShopManager'));
const ListSale = React.lazy(() => import('./views/base/tables/ListSale'));
const ListCustomer = React.lazy(() => import('./views/base/tables/ListCustomer'));
const HardWare = React.lazy(() => import('./views/base/tables/HardWare'));
const Order = React.lazy(() => import('./views/base/tables/CreateOrder'));
const OrderTable = React.lazy(() => import('./views/base/tables/OrderTable'));
const TransactionTable = React.lazy(() => import('./views/base/tables/Transaction'));
const HardWareManager = React.lazy(() => import('./views/base/tables/HardWareManager'));
const Profile = React.lazy(() => import('./views/users/ProfileUser'));
const SPENDING = React.lazy(() => import('./views/base/tables/SpendingOrder'));
const CheckOrder = React.lazy(() => import('./views/base/tables/CheckOrder'));
const BrandHard = React.lazy(() => import('./views/base/tables/Brand'));
const ProductHard = React.lazy(() => import('./views/base/tables/Product'));
const CheckProduct = React.lazy(() => import('./views/base/tables/CheckOrderByProduct'));
const Category = React.lazy(() => import('./views/base/tables/Category'));
const ConfigSystem = React.lazy(() => import('./views/base/tables/ConfigSystem'));
const HistorySkin = React.lazy(() => import('./views/base/tables/HistorySkin'));
const SuggestItem = React.lazy(() => import('./views/base/tables/AdminApp/Skins/SuggestItems'));
const BrandApp = React.lazy(() => import('./views/base/tables/AdminApp/MakeUp/Brand'));
const SubTypeApp = React.lazy(() => import('./views/base/tables/AdminApp/MakeUp/SubType'));
const ColorApp = React.lazy(() => import('./views/base/tables/AdminApp/MakeUp/Color'));
const ProductApp = React.lazy(() => import('./views/base/tables/AdminApp/MakeUp/Product'));
const ProductHair = React.lazy(() => import('./views/base/tables/AdminApp/Hair/Product'));
const ColorHair = React.lazy(() => import('./views/base/tables/AdminApp/Hair/Color'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: TableUser },
  { path: '/company', name: 'Company', component: TableCompany },
  { path: '/key', name: 'Key', component: TableKey },
  { path: '/key_order', name: 'Key', component: TableKeyOrder },
  { path: '/pakage_sale', name: 'Sale', component: TablePakageSale },
  { path: '/pakage_sale_log', name: 'SaleLog', component: TablePakageSaleLog },
  { path: '/type_key', name: 'TypeKey', component: TableTypeKey },
  { path: '/role', name: 'Role', component: TableRole },
  { path: '/link', name: 'Key', component: TableLink },
  { path: '/history', name: 'HistorySkin', component: HistorySkinUser },
  { path: '/sales', name: 'ShopManager', component: ListSale },
  { path: '/shopmanager', name: 'ShopManager', component: ListShopManager },
  { path: '/customers', name: 'Customers', component: ListCustomer },
  { path: '/hardware', name: 'HardWares', component: HardWare },
  { path: '/orders', name: 'Orders', component: Order },
  { path: '/order_table', name: 'Order Table', component: OrderTable },
  { path: '/transaction', name: 'Transaction', component: TransactionTable },
  { path: '/hardwaremanager', name: 'HardWare', component: HardWareManager },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/spending_order', name: 'SPENDING', component: SPENDING },
  { path: '/doanh_so', name: 'SPENDING', component: CheckOrder },
  { path: '/thuong_hieu', name: 'SPENDING', component: BrandHard },
  { path: '/san_pham', name: 'SPENDING', component: ProductHard },
  { path: '/doanh_so_theo_san_pham', name: 'SPENDING', component: CheckProduct },
  { path: '/danh_muc', name: 'SPENDING', component: Category },
  { path: '/cau_hinh_gian_hang', name: 'SPENDING', component: ConfigSystem },
  { path: '/lich_su_soi_da', name: 'SPENDING', component: HistorySkin },
  { path: '/suggest/K1', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/suggest/K5', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/suggest/K6', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/suggest/K7', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/suggest/K8', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/suggest/K9', name: 'SUGGEST_ITEM', component: SuggestItem },
  { path: '/quan_ly_thuong_hieu_trang_diem', name: 'BRANDS', component: BrandApp },
  { path: '/quan_ly_danh_muc_trang_diem', name: 'SUBTYPE', component: SubTypeApp },
  { path: '/quan_ly_mau_trang_diem', name: 'COLOR', component: ColorApp },
  { path: '/quan_ly_san_pham_trang_diem', name: 'PRODUCT', component: ProductApp },
  { path: '/quan_ly_san_pham_toc', name: 'PRODUCT', component: ProductHair },
  { path: '/quan_ly_ma_mau_toc', name: 'COLOR', component: ColorHair },
];

export default routes;
