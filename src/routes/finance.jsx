import NoFeaturePage from "views/Errors/NoFeature.jsx";

var financeRoutes = [
  {
    path: "/finance/sales-invoice",
    name: "Sales Invoice",
    mini: "SI",
    component: NoFeaturePage
  },
  {
    path: "/finance/purchase-challan",
    name: "Purchase Challan",
    mini: "PC",
    component: NoFeaturePage
  },
  {
    path: "/finance/expenses",
    name: "Expenses",
    mini: "EX",
    component: NoFeaturePage
  }
]

export default financeRoutes;