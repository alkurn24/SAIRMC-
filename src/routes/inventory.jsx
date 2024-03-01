import ProductListPage from "modules/inventory/products/views/ProductListPage.jsx";
import AddEditProductPage from "modules/inventory/products/views/AddEditProductPage.jsx";
import StoresListPage from "modules/inventory/stores/views/StoresListPage.jsx";
import AddEditSroresPage from "modules/inventory/stores/views/AddEditSroresPage.jsx";
import AddEditDieselConsumptionPage from "modules/inventory/stores/views/AddEditDieselConsumptionPage.jsx";
import ServiceListPage from "modules/inventory/services/views/ServiceListPage.jsx";
import AddEditServicePage from "modules/inventory/services/views/AddEditServicePage.jsx";



var inventoryRoutes = [
  {
    path: "/inventory/product",
    name: "Manage Products",
    mini: "MP",
    component: ProductListPage
  },
  {
    subpage: true,
    path: "/inventory/product-edit/:productcode",
    name: "Add/Update Product",
    component: AddEditProductPage
  },

  {
    path: "/inventory/stores",
    name: "Store Items",
    mini: "SI",
    component: StoresListPage
  },
  {
    subpage: true,
    path: "/inventory/stores-edit/:itemcode",
    name: "Add/Update Store Item",
    component: AddEditSroresPage
  },
  {
    subpage: true,
    path: "/inventory/diesel-edit/:movementcode",
    name: "Add/Update Diesel Issue",
    component: AddEditDieselConsumptionPage
  },

  {
    path: "/inventory/service",
    name: "Manage Services",
    mini: "MS",
    component: ServiceListPage
  },
  {
    subpage: true,
    path: "/inventory/service-edit/:servicecode",
    name: "Add/Update Service",
    component: AddEditServicePage
  },


];



export default inventoryRoutes;