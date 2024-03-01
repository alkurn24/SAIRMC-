import DashboardPage from "../modules/dashboard/views/DashboardPage";
import MyWorklistPage from "modules/worklist/views/MyWorklistPage.jsx";
import salesRoutes from "./sales.jsx";
import inventoryRoutes from "./inventory.jsx";
import settingsRoutes from "./settings.jsx";
// import financeRoutes from "./finance.jsx";
import crmRoutes from "./crm.jsx";
import purchaseRoutes from "./purchase.jsx";
import hrmsRoutes from "./hrms.jsx";
import assetsRoutes from "./assets.jsx";
import movementRoutes from "./movement.jsx";
import productionRoutes from "./production.jsx";
// import qualityRoutes from "./quality.jsx";
// import fleetRoutes from "./fleet.jsx";
import testMgmtRoutes from "./testmgmt.jsx";
import transporterMgmtRoutes from "./transportermgmt.jsx";
// import FullScreenMap from "../Maps/FullScreenMap";
import reportsRoutes from "./reports.jsx";
// import worklistRoutes from "./worklist.jsx";


var salesViews = [].concat(salesRoutes)
var inventoryViews = [].concat(inventoryRoutes)
var settingsViews = [].concat(settingsRoutes)
var crmViews = [].concat(crmRoutes)
var purchaseViews = [].concat(purchaseRoutes)
var assetsViews = [].concat(assetsRoutes)
// var financeViews = [].concat(financeRoutes)
var movementViews = [].concat(movementRoutes)
var transporterViews = [].concat(transporterMgmtRoutes)
var productionViews = [].concat(productionRoutes)
// var hrmsViews = [].concat(hrmsRoutes)
var testMgmtViews = [].concat(testMgmtRoutes)
var reportsViews = [].concat(reportsRoutes)
// var worklistViews = [].concat(worklistRoutes);
var hrmsViews = [].concat(hrmsRoutes);


var appRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "fa fa-tachometer",
    component: DashboardPage,
    roles: ['admin', 'user', 'purchase', 'sales']
  },

  {
    path: "/my-worklist",
    name: "My Worklist",
    icon: "fa fa-briefcase",
    component: MyWorklistPage,
    roles: ["admin", "quality"]
  },
  {
    collapse: true,
    path: "/sales",
    name: "Sales",
    state: "openSales",
    icon: "fa fa-shopping-cart",
    views: salesViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'quality']
  },
  {
    collapse: true,
    path: "/purchase",
    name: "Purchase",
    state: "openPurchase",
    icon: "fa fa-shopping-basket",
    views: purchaseViews,
    roles: ['admin', 'accounts', 'stores', 'purchase']
  },

  {
    collapse: true,
    path: "/test",
    name: "Quality",
    state: "openTestMgmt",
    icon: "fa fa-flask",
    views: testMgmtViews,
    roles: ['admin', 'sales', 'accounts', 'stores', 'quality']
  },
  {
    collapse: true,
    path: "/production",
    name: "Production",
    state: "openProduction",
    icon: "fa fa-industry",
    views: productionViews,
    roles: ['admin', 'sales', 'accounts', 'quality']
  },
  {
    collapse: true,
    path: "/movements",
    name: "Movement",
    state: "openMovement",
    icon: "fa fa-exchange",
    views: movementViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'quality']
  },
  {
    collapse: true,
    path: "/inventory",
    name: "Inventory / Stores",
    state: "openInventory",
    icon: "fa fa-server",
    views: inventoryViews,
    roles: ['admin', 'accounts', 'stores', 'purchase']
  },

  {
    collapse: true,
    path: "/assetsManagement",
    name: "Assets Management",
    state: "openAssets",
    icon: "fa fa-pie-chart",
    views: assetsViews,
    roles: ['admin', 'accounts', 'dispatch', 'stores', 'purchase']
  },

  {
    collapse: true,
    path: "/crm",
    name: "CRM",
    state: "openCrm",
    icon: "fa fa-users",
    views: crmViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'quality']
  },

  // {
  //   collapse: true,
  //   path: "/hrms",
  //   name: "HRMS",
  //   state: "openHrms",
  //   icon: "fa fa-users",
  //   views: hrmsViews,
  //   roles: ['admin',]
  // },
  {
    collapse: true,
    path: "/transporter",
    name: "Transporter",
    state: "openTransporter",
    icon: "fa fa-truck",
    views: transporterViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'stores', 'quality', 'purchase']
  },
  // {
  //   collapse: true,
  //   path: "/finance",
  //   name: "Finance",
  //   state: "openFinance",
  //   icon: "fa fa-rupee",
  //   views: financeViews,
  //   roles: ['admin', 'finance']
  // },
  //
  {
    collapse: true,
    path: "/settings",
    name: "Settings",
    state: "openSettings",
    icon: "fa fa-cog",
    views: settingsViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'stores', 'quality', 'purchase']
  },
  {
    collapse: true,
    path: "/reports",
    name: "Reports",
    state: "openReports",
    icon: "fa fa-file",
    views: reportsViews,
    roles: ['admin', 'sales', 'accounts', 'dispatch', 'quality', 'stores', 'purchase', 'hr'],
  },
  //{
  //  path: "/maps",
  //  name: "Maps ",
  //  icon: "pe-7s-map-marker",
  //  component: FullScreenMap,
  //  roles: ['admin', 'security']
  // },

  { redirect: true, path: "/", pathTo: "/login", name: "Home" }
];
export default appRoutes;
