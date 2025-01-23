import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Customer_Page = React.lazy(() => import('./views/Manager/Customer_Page'))
//manager
const Staff_Page = React.lazy(() => import('./views/Manager/Staff_Page'));

const Quote_Page_Manager = React.lazy(() => import('./views/Manager/Quote_Page'));
const Quote_Price_Page_Manager = React.lazy(() => import('./views/Manager/Quote_Price'));

const Order_Page_Manager = React.lazy(() => import('./views/Manager/Order_Page'));
const Order_Price_Page_Manager = React.lazy(() => import('./views/Manager/Order_Price'));
const Order_Refund_Page_Manager = React.lazy(() => import('./views/Manager/Order_Refund'));
const Transactions_Page_Manager = React.lazy(() => import('./views/Manager/Transaction_Page'));

const Model_Page = React.lazy(() => import('./views/Manager/Model_Page'));

const Metal_Page = React.lazy(() => import('./views/Manager/Metal_Page'));
const Diamond_Page = React.lazy(() => import('./views/Manager/Diamond_Page'));

//sale staff
const Quote_Page_SaleStaff = React.lazy(() => import('./views/Sale_staff/Quote_Page'));
const Quote_Detail_SaleStaff = React.lazy(() => import('./views/Sale_staff/Quote_Detail'));

const Order_Page_SaleStaff = React.lazy(() => import('./views/Sale_staff/Order_Page'));
const Order_Price_Page_SaleStaff = React.lazy(() => import('./views/Sale_staff/Order_Price'));

//design staff
const Order_Page_DesignStaff = React.lazy(() => import('./views/Design_staff/Order_Page'));
const Order_Detail_DesignStaff = React.lazy(() => import('./views/Design_staff/Order_Detail'));

const Design_Process_DesignStaff = React.lazy(() => import('./views/Design_staff/Design_Page'));

//production staff

const Order_Page_ProductionStaff = React.lazy(() => import('./views/Production_staff/Order_Page'));
const Order_Production_Complete_Page_ProductionStaff = React.lazy(() => import('./views/Production_staff/Order_Production_Complete_Page'));



const Profile = React.lazy(() => import('./views/test/ProfileDetails/index'))
const ProductList = React.lazy(() => import('./views/test/Product/ProductTable'))
const ProductAdd = React.lazy(() => import('./views/test/Product/ProductAdd'))
const ItemsManage = React.lazy(() => import('./views/test/ItemsManage/index'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, role_id: [1] },
  { path: '/customers/table', name: 'Customers', element: Customer_Page, role_id: [1,2] },

  //manager
  { path: '/staffs_manager/table', name: 'Staffs', element: Staff_Page, role_id: [1] },

  { path: '/quotes_manager', name: 'Quote', element: null, exact: true },
  { path: '/quotes_manager/table', name: 'Main Quotes List', element: Quote_Page_Manager, role_id: [1] },
  { path: '/quotes_manager/price_reporting', name: 'Quotes\'s Price Reporting', element: Quote_Price_Page_Manager, role_id: [1] },

  { path: '/orders_manager', name: 'Order', element: null, exact: true },
  { path: '/orders_manager/table', name: 'Main Orders List', element: Order_Page_Manager, role_id: [1] },
  { path: '/orders_manager/price_reporting', name: 'Orders\'s Price Reporting', element: Order_Price_Page_Manager, role_id: [1] },
  { path: '/orders_manager/refund', name: 'Refund Orders List', element: Order_Refund_Page_Manager, role_id: [1] },
  { path: '/orders_manager/transactions', name: 'Refund Orders List', element: Transactions_Page_Manager, role_id: [1,2] },

  { path: '/mounting', name: 'Mounting', element: null, exact: true },
  { path: '/mounting/ring/table', name: 'Ring Models Management', element: Model_Page, props: { mounting_type: { id: 1, name: 'Ring' } }, role_id: [1] },
  { path: '/mounting/band/table', name: 'Band Models Management', element: Model_Page, props: { mounting_type: { id: 2, name: 'Band' } }, role_id: [1] },
  { path: '/mounting/pendant/table', name: 'Pendant Models Management', element: Model_Page, props: { mounting_type: { id: 3, name: 'Pendant' } }, role_id: [1] },

  { path: '/material', name: 'Meterial', element: null, exact: true },
  { path: '/material/metal/table', name: 'Metal Price Management', element: Metal_Page, role_id: [1] },
  { path: '/material/diamond/table', name: 'Diamond Price Management', element: Diamond_Page, role_id: [1] },
  //sale staff

  { path: '/quotes_sale_staff/table', name: 'Main Quotes List', element: Quote_Page_SaleStaff, role_id: [2] },
  { path: '/quotes_sale_staff/detail/:id', name: 'Quote Pricing', element: Quote_Detail_SaleStaff, role_id: [2] },

  { path: '/orders_sale_staff/table', name: 'Main Orders List', element: Order_Page_SaleStaff, role_id: [2] },
  { path: '/orders_sale_staff/design_process', name: 'Orders Pricing', element: Order_Price_Page_SaleStaff, role_id: [2] },

  //design staff
  
  { path: '/orders_design_staff/table', name: 'Assigned Orders', element: Order_Page_DesignStaff, role_id: [3] },
  { path: '/orders_design_staff/detail/:id', name: 'Create Design Process', element: Order_Detail_DesignStaff, role_id: [3] },
 
  { path: '/orders_design_staff/design_process', name: 'Main Design Processes List', element: Design_Process_DesignStaff, role_id: [3] },

  //production staff

  { path: '/orders_production_staff/table', name: 'Assigned Orders', element: Order_Page_ProductionStaff, role_id: [4] },
  { path: '/orders_design_staff/completed_orders', name: 'Orders Completion', element: Order_Production_Complete_Page_ProductionStaff, role_id: [4] },










  { path: '/profile', name: 'profile', element: Profile },
  { path: '/profile2', name: 'profile2', element: Profile },
  { path: '/product', name: 'product' },
  { path: '/product/table', name: 'product table', element: ProductList },
  { path: '/product/add', name: 'product add form', element: ProductAdd },
  { path: '/ItemsManage', name: 'items manage', element: ItemsManage },


]

export default routes
