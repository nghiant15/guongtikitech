import React from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons';
const _nav = [
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Danh mục'],
    role: ['ADMIN', 'ADMINSALE']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Tổng quan',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hồ sơ',
    to: '/profile',
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lí khách hàng TIKITECH'],
    role: ['ADMIN', 'ADMINSALE']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Danh sách',
    icon: 'cil-star',
    role: ['ADMIN', 'ADMINSALE'],
    _children: [{
      _tag: 'CSidebarNavItem',
      name: 'Danh sách công ty',
      to: '/company',
      role: ['ADMIN', 'ADMINSALE'],
    }]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý phần cứng'],
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Cấu hình phần cứng',
    icon: 'cil-star',
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES'],
    _children: [{
      _tag: 'CSidebarNavItem',
      name: 'Danh sách shop',
      to: '/shopmanager',
      role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SALES', 'SHOPMANAGER']
    }, {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách sale',
      to: '/sales',
      role: ['ADMIN', 'ADMINSALE', 'COMPANY']
    }, {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách phần cứng',
      to: '/hardware',
      role: ['ADMIN', 'ADMINSALE']
    }, {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách sở hữu phần cứng',
      to: '/hardwaremanager',
      role: ['COMPANY']
    }, {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách key',
      to: '/key',
      role: ['ADMIN', 'ADMINSALE']
    }]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý soi da'],
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hỗ trợ giảm lão hóa da',
    to: '/suggest/K5',
    icon: <CIcon content={freeSet.cilMoodVeryGood} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hỗ trợ điều trị mụn',
    to: '/suggest/K6',
    icon: <CIcon content={freeSet.cilMoodVeryGood} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hỗ trợ giảm quầng thâm mắt',
    to: '/suggest/K7',
    icon: <CIcon content={freeSet.cilMoodVeryGood} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hỗ trợ giảm lỗ chân lông',
    to: '/suggest/K8',
    icon: <CIcon content={freeSet.cilMoodVeryGood} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hỗ trợ giảm thâm nám da',
    to: '/suggest/K9',
    icon: <CIcon content={freeSet.cilMoodVeryGood} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý trang điểm'],
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Nhãn hiệu sản phẩm trang điểm',
    to: '/quan_ly_thuong_hieu_trang_diem',
    icon: <CIcon content={freeSet.cilBookmark} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Danh mục',
    to: '/quan_ly_danh_muc_trang_diem',
    icon: <CIcon content={freeSet.cilList} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mã màu',
    to: '/quan_ly_mau_trang_diem',
    icon: <CIcon content={freeSet.cilList} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sản phẩm',
    to: '/quan_ly_san_pham_trang_diem',
    icon: <CIcon content={freeSet.cilList} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý màu tóc'],
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sản phẩm',
    to: '/quan_ly_san_pham_toc',
    icon: <CIcon content={freeSet.cilList} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mã màu',
    to: '/quan_ly_ma_mau_toc',
    icon: <CIcon content={freeSet.cilList} customClasses="c-sidebar-nav-icon" />,
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lí người dùng'],
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Danh sách người dùng',
    icon: 'cil-star',
    to: '/customers',
    role: ['ADMIN', 'ADMINSALE', 'COMPANY', 'SHOPMANAGER', 'SALES']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Lịch sử soi da'],
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Lịch sử soi da',
    icon: 'cil-star',
    to: '/lich_su_soi_da',
    role: ['ADMIN', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Thông tin đơn hàng'],
    role: ['ADMIN', 'ADMINSALE']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Thông tin đơn hàng',
    icon: 'cil-star',
    role: ['ADMIN', 'ADMINSALE'],
    _children: [{
      _tag: 'CSidebarNavItem',
      name: 'Tạo đơn hàng',
      to: '/orders',
      role: ['ADMIN', 'ADMINSALE']
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách đơn hàng',
      to: '/order_table',
      role: ['ADMIN', 'ADMINSALE']
    }, {
      _tag: 'CSidebarNavItem',
      name: 'Danh sách giao dịch',
      to: '/transaction',
      role: ['ADMIN', 'ADMINSALE']
    },
      //{
      //   _tag: 'CSidebarNavItem',
      //   name: 'Đơn hàng chờ thanh toán',
      //   to: '/spending_order',
      //   role: ['COMPANY']
      // }
    ]
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý sản phẩm sale PG'],
    role: ['COMPANY', 'SALES', 'ADMIN', 'SHOPMANAGER']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Danh mục',
    icon: 'cil-star',
    to: '/danh_muc',
    role: ['COMPANY', 'SALES', 'ADMIN', 'SHOPMANAGER']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Thương hiệu',
    icon: 'cil-star',
    to: '/thuong_hieu',
    role: ['COMPANY', 'SALES', 'ADMIN', 'SHOPMANAGER']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Sản phẩm',
    icon: 'cil-star',
    to: '/san_pham',
    role: ['COMPANY', 'SALES', 'ADMIN', 'SHOPMANAGER']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Thông kê doanh số sale PG'],
    role: ['COMPANY', 'ADMIN']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Theo đơn hàng',
    icon: 'cil-star',
    to: '/doanh_so',
    role: []
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Thống kê doanh số theo sản phẩm',
    icon: 'cil-star',
    to: '/doanh_so_theo_san_pham',
    role: ['ADMIN', 'ADMINSALE', 'COMPANY']
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Cấu hình hệ thống'],
    role: ['ADMIN']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Cấu hình gian hàng',
    icon: 'cil-star',
    to: '/cau_hinh_gian_hang',
    role: ['ADMIN']
  },
]

export default _nav
