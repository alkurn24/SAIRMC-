import InventorySettingsListPage from "modules/settings/inventory/views/InventorySettingsListPage.jsx";
import PlantListPage from "modules/settings/plants/views/PlantListPage.jsx";
import HsnListPage from "modules/settings/hsn/views/HsnListPage.jsx";
import EditProfile from "../views/EditProfile/views/EditProfilePage.jsx";
import ChangePassword from "../views/ChangePassword/views/ChangePasswordPage.jsx";
import UserListPage from "modules/settings/usermgmt/views/UsersListPage.jsx";
import TermsListPage from "modules/settings/terms&conditions/views/TermsListPage.jsx";
// import UnitListPage from "modules/settings/units/views/UnitListPage.jsx";

var settingsRoutes = [
  {
    path: "/settings/user",
    name: "User Management",
    mini: "UM",
    component: UserListPage,
    roles: ['admin', 'sales', 'accounts', 'quality']
  },
  // {
  //   subpage: true,
  //   path: "/settings/userManagement-edit/:id",
  //   name: "User Management",
  //   mini: "UM",
  //   component: AddEditUserPage
  // },
  {
    path: "/settings/inv-type",
    name: "Inventory Management",
    mini: "IM",
    component: InventorySettingsListPage,
    roles: ['admin', 'stores', 'accounts', 'quality', 'purchase']
  },
  {
    subpage: true,
    path: "/settings/user-edit/",
    name: "View Profile",
    component: EditProfile
  },
  {
    path: "/settings/plants",
    name: " Plants Management",
    mini: "PM",
    component: PlantListPage,
    roles: ['admin', 'dispatch', 'quality']
  },

  {
    path: "/settings/hsn",
    name: "HSN Management",
    mini: "HM",
    component: HsnListPage,
    roles: ['admin', 'sales', 'accounts']
  },
  // {
  //   path: "/settings/unit",
  //   name: "Unit of Measurement",
  //   mini: "UOM",
  //   component: UnitListPage,
  //   roles: ['admin', 'sales', 'accounts']
  // },
  {
    path: "/settings/terms",
    name: "Terms & Conditions",
    mini: "TC",
    component: TermsListPage,
    roles: ['admin', 'sales', 'accounts']
  },

  {
    subpage: true,
    path: "/settings/change-password-edit/:code",
    name: "Update Change Password",
    component: ChangePassword
  },

  // {
  //   path: "/settings/transporters",
  //   name: "Transporters Management",
  //   mini: "TM",
  //   component: TransporterListPage
  // },
];

export default settingsRoutes;