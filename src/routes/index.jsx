import Landing from "layouts/Landing/Landing.jsx";
import App from "layouts/App/App.jsx";
import ChangePassword from "../views/ChangePassword/views/ChangePasswordPage.jsx";
import EditProfile from "../views/EditProfile/views/EditProfilePage.jsx";

var indexRoutes = [
  { path: "/changepassword", component: ChangePassword },
  { path: "/worklist", name: "App", component: App },
  { path: "/my-worklist", name: "App", component: App },
  { path: "/editprofile", component: EditProfile },
  { path: "/settings", name: "App", component: App },
  { path: "/crm", name: "App", component: App },
  { path: "/dashboard", name: "App", component: App },
  { path: "/hrms", name: "App", component: App },
  { path: "/movements", name: "App", component: App },
  { path: "/inventory", name: "App", component: App },
  { path: "/purchase", name: "App", component: App },
  { path: "/sales", name: "App", component: App },
  { path: "/assets", name: "App", component: App },
  { path: "/production", name: "App", component: App },
  { path: "/quality", name: "App", component: App },
  { path: "/fleet", name: "App", component: App },
  { path: "/finance", name: "App", component: App },
  { path: "/test", name: "App", component: App },
  { path: "/transporter", name: "App", component: App },
  { path: "/security", name: "App", component: App },
  { path: "/maps", name: "App", component: App },
  { path: "/reports", name: "App", component: App },
  { path: "/", name: "Home", component: Landing }
];

export default indexRoutes;
