import EmployeeListPage from "modules/hrms/employees/views/EmployeeListPage.jsx";
import AddEditEmployeePage from "modules/hrms/employees/views/AddEditEmployeePage.jsx";
import LeaveTypeListPage from "modules/hrms/leavtypes/views/LeaveTypeListPage.jsx";
import PayrollHeads from "modules/hrms/payrollheads/views/PayrollHeadsListPage.jsx";
// import NoFeaturePage from "views/Errors/NoFeature.jsx";

var crmRoutes = [
  {
    path: "/hrms/employees",
    name: "Manage Employees",
    mini: "ME",
    component: EmployeeListPage
  },
  {
    subpage: true,
    path: "/hrms/employees-edit/:code",
    name: "Add/Update Employee",
    component: AddEditEmployeePage
  },
  {
    path: "/hrms/leavetypes",
    name: " Manage Leave Types",
    mini: "ML",
    component: LeaveTypeListPage
  },
  {
    path: "/hrms/payrollheads",
    name: "Payroll Heads",
    mini: "PH",
    component: PayrollHeads
  }
  // {
  //   path: "/hrms/leaves",
  //   name: "Leaves Tracker",
  //   mini: "LT",
  //   component: NoFeaturePage
  // },
  // {
  //   path: "/hrms/payroll",
  //   name: "Payroll",
  //   mini: "P",
  //   component: NoFeaturePage
  // },
  // {
  //   path: "/hrms/reimbursements",
  //   name: "Reimbursements",
  //   mini: "RI",
  //   component: NoFeaturePage
  // },
  // {
  //   path: "/hrms/attendance",
  //   name: "Attendance Tracker",
  //   mini: "AT",
  //   component: NoFeaturePage
  // },
  // {
  //   path: "/hrms/labour-contracts",
  //   name: "Labour Contracts",
  //   mini: "LC",
  //   component: NoFeaturePage
  // },
  // {
  //   path: "/hrms/gatepass",
  //   name: "Gatepass",
  //   mini: "GT",
  //   component: NoFeaturePage
  // },
]

export default crmRoutes;