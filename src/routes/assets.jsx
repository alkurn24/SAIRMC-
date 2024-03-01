import MaintenanceCalendarComponent from "../modules/assetsmgmt/maintenance/components/MaintenanceCalendarComponent.jsx";
import MaintenanceListComponent from "../modules/assetsmgmt/maintenance/components/MaintenanceListComponent.jsx";
import AssetsListComponent from "../modules/assetsmgmt/assets/components/AssetsListComponent.jsx";
import AddEditAssetComponent from "../modules/assetsmgmt/assets/components/AddEditAssetComponent.jsx";

var assetsRoutes = [
  {
    path: "/assets/assets",
    name: "Manage Assets ",
    mini: "MA",
    component: AssetsListComponent
  },
  {
    subpage: true,
    path: "/assets/assets-edit/:itemcode",
    name: "Add/Update Asset",
    component: AddEditAssetComponent
  },
  {
    path: "/assets/maintenance/calendar",
    name: "Maintenance Calendar",
    mini: "MC",
    component: MaintenanceCalendarComponent
  },
  {
    path: "/assets/maintenance/maintenancelog",
    name: "Maintenance Log",
    mini: "ML",
    component: MaintenanceListComponent
  },
]

export default assetsRoutes;