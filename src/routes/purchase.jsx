import VendorsListPage from "modules/purchase/vendor/views/VendorsListPage.jsx";
import AddEditVendorsPage from "modules/purchase/vendor/views/AddEditVendorsPage.jsx"
import PurchaseOrdersListPage from "modules/purchase/orders/views/PurchaseOrdersListPage.jsx";
import AddEditOrderPage from "modules/purchase/orders/views/AddEditOrderPage.jsx";
import PurchaseRequestListPage from "modules/purchase/purchaseRequest/views/PurchaseRequestListPage.jsx";
import AddEditPurchaseRequestPage from "modules/purchase/purchaseRequest/views/AddEditPurchaseRequestPage.jsx";
import GrnListPage from "modules/purchase/grn/views/GrnListPage.jsx";
import AddEditGrnPage from "modules/purchase/grn/views/AddEditGrnPage.jsx";

var purchaseRoutes = [
  {
    path: "/purchase/vendor",
    name: "Manage Vendors",
    mini: "MV",
    component: VendorsListPage
  },
  {
    subpage: true,
    path: "/purchase/vendor-edit/:vendorcode",
    name: "Add/Update Vendors",
    component: AddEditVendorsPage
  },
  {
    path: "/purchase/purchaserequest",
    name: "Purchase Request",
    mini: "PR",
    component: PurchaseRequestListPage
  },
  {
    subpage: true,
    path: "/purchase/purchaserequest-edit/:code",
    name: "Add/Update Purchase Request",
    component: AddEditPurchaseRequestPage
  },
  {
    path: "/purchase/orders",
    name: " Purchase Orders",
    mini: "Po",
    component: PurchaseOrdersListPage
  },
  {
    subpage: true,
    path: "/purchase/orders-edit/:pocode",
    name: "Add/Update Purchase Order",
    component: AddEditOrderPage
  },
  {
    path: "/purchase/grn",
    name: "Goods Received Note",
    mini: "GRN",
    component: GrnListPage
  },
  {
    subpage: true,
    path: "/purchase/grn-edit/:grncode",
    name: "Add/Update GRN",
    mini: "GRN",
    component: AddEditGrnPage
  },

]

export default purchaseRoutes;