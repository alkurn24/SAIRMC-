import LoginPage from "views/User/LoginPage.jsx";
import LockScreenPage from "views/User/LockScreenPage.jsx";
import ForgotPasswordPage from "../views/User/ForgotPasswordPage";

var userRoutes = [
  { path: "/login", component: LoginPage },
  { path: "/lock-screen", component: LockScreenPage },
  { path: "/forget-password/:token", component: ForgotPasswordPage },
  { redirect: true, path: "/", pathTo: "/login" }
];

export default userRoutes;
