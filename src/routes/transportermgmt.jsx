import TransporterListPage from "../modules/transportermgmt/transporters/views/TransporterListPage.jsx";
import AddEditTransporterPage from "../modules/transportermgmt/transporters/views/AddEditTransporterPage.jsx";

var transporterMgmtRoutes = [
  
  {
    path: "/transporter/transporters",
    name: "Manage Transporter",
    mini: "MT",
    component: TransporterListPage
  },
  {
    subpage: true,
    path: "/transporter/transporters-edit/:code",
    name: "Add/Update Transporter",
    component: AddEditTransporterPage
  },
];

export default transporterMgmtRoutes;