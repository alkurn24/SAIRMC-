// import NoFeaturePage from "views/Errors/NoFeature.jsx";
// import RecipeListPage from "modules/production/recipe/views/RecipeListPage.jsx";
// import AddEditRecipePage from "modules/production/recipe/views/AddEditRecipePage.jsx";
import BoMListPage from "modules/production/bom/views/BoMListPage.jsx";
import AddEditBoMPage from "modules/production/bom/views/AddEditBoMPage.jsx";
// import ProductScheduleListPage from "modules/production/productionSchedule/views/ProductScheduleListPage.jsx";

var productionRoutes = [
  // {
  //   path: "/production/schedule",
  //   name: "Production Schedule",
  //   mini: "PS",
  //   component: ProductScheduleListPage
  // },
  // {
  //   path: "/production/recipe",
  //   name: "Recipe",
  //   mini: "RP",
  //   component: RecipeListPage
  // },
  // {
  //   subpage: true,
  //   path: "/production/recipe-edit/:recipecode",
  //   name: "Add/Edit Recipe",
  //   mini: "RP",
  //   component: AddEditRecipePage
  // }
  {
    path: "/production/bom",
    name: "Bom",
    mini: "BOM",
    component: BoMListPage
  },
  {
    subpage: true,
    path: "/production/bom-edit/:bomcode",
    name: "Add/Edit BOM",
    mini: "RP",
    component: AddEditBoMPage
  }
]

export default productionRoutes;