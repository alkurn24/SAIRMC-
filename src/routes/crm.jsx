import CustomersListPage from "modules/crm/customers/views/CustomersListPage.jsx";
import AddEditCustomerPage from "modules/crm/customers/views/AddEditCustomerPage.jsx";

var crmRoutes = [
  {
    path: "/crm/customers",
    name: "Manage Customers",
    mini: "MC",
    component: CustomersListPage
  },
  {
    subpage: true,
    path: "/crm/customers-edit/:customercode",
    name: "Add/Update Customer",
    component: AddEditCustomerPage
  },
 ]

export default crmRoutes;