import SalesOrdersListPage from "modules/sales/orders/views/SalesOrdersListPage.jsx";
import AddEditOrderPage from "modules/sales/orders/views/AddEditOrderPage.jsx";
import DispatchListSchedulePage from "modules/sales/dispatchschedule/views/DispatchListSchedulePage.jsx";
import AddEditDispatchSchedulePage from "modules/sales/dispatchschedule/views/AddEditDispatchSchedulePage.jsx";
import DispatchListPage from "modules/sales/dispatches/views/DispatchListPage.jsx";
import AddEditDispatchPage from "modules/sales/dispatches/views/AddEditDispatchPage.jsx";

var salesRoutes = [

  {
    path: "/sales/orders",
    name: "Manage Orders",
    mini: "MO",
    component: SalesOrdersListPage
  },
  {
    subpage: true,
    path: "/sales/orders-edit/:code",
    name: "Add/Update Order",
    component: AddEditOrderPage
  },
  {
    path: "/sales/schedule",
    name: "Dispatche Schedule",
    mini: "DS",
    component: DispatchListSchedulePage
  },
  {
    subpage: true,
    path: "/sales/schedule-edit/:code",
    name: "Add/Update Dispatch Schedule",
    mini: "DS",
    component: AddEditDispatchSchedulePage
  },

  {
    path: "/sales/dispatch",
    name: "Dispatches",
    mini: "DES",
    component: DispatchListPage
  },
  {
    subpage: true,
    path: "/sales/dispatch-edit/:dispatchcode",
    name: "Add/Update Dispatch",
    mini: "DES",
    component: AddEditDispatchPage
  },
];

export default salesRoutes;