import NoFeaturePage from "views/Errors/NoFeature.jsx";

var fleetRoutes = [
  {
    path: "/fleet/manage",
    name: "Fleet Management",
    mini: "FM",
    component: NoFeaturePage
  },
  {
    path: "/fleet/maintenance",
    name: "Maintenance",
    mini: "MT",
    component: NoFeaturePage
  }
]

export default fleetRoutes;