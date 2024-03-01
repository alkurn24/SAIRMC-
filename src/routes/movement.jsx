import MovementListPage from "modules/movement/views/MovementListPage.jsx";
import AddEditMovementPage from "modules/movement/views/AddEditMovementPage.jsx";


var movementRoutes = [

  {
    path: "/movements/movement/",
    name: "Manage Movement",
    mini: "MM",
    component: MovementListPage
  },
  {
    subpage: true,
    path: "/movements/movement-edit/:movementcode",
    name: "Add/Update Movement",
    component: AddEditMovementPage
  },


];

export default movementRoutes;