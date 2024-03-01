import TestReportListPage from "modules/testmgmt/testreport/views/TestReportListPage.jsx";
import AddEditTestReportPage from "modules/testmgmt/testreport/views/AddEditTestReportPage.jsx";
import TestCaseListPage from "modules/testmgmt/testcase/views/TestCaseListPage.jsx";
import AddEditTestCasePage from "modules/testmgmt/testcase/views/AddEditTestCasePage.jsx";
// import TestParamsListPage from "modules/testmgmt/testparams/views/TestParamsListPage.jsx";
// import AddEditTestParamsPage from "modules/testmgmt/testparams/views/AddEditTestParamsPage.jsx";
import TestMaterialListPage from "modules/testmgmt/testmaterial/views/TestMaterialListPage.jsx";
import AddEditTestMaterialPage from "modules/testmgmt/testmaterial/views/AddEditTestMaterialPage.jsx";
// import TestReportListPage from "modules/testmgmt/testreport/reinforcementsteel/views/TestReportListPage.jsx";
// import HandMetalListPage from "modules/testmgmt/testreport/metalreport/views/HandMetalListPage.jsx";
// import ConcreteCubeListPage from "modules/testmgmt/testreport/concretecubereport/views/ConcreteCubeListPage.jsx";

var testMgmtRoutes = [
  {
    path: "/test/reports",
    name: "Test Reports",
    mini: "TR",
    component: TestReportListPage,
    roles: ['admin', 'sales', 'accounts', 'stores', 'quality']
  },
  {
    subpage: true,
    path: "/test/reports-edit/:testreportcode",
    name: "Add/Edit Test Reports",
    component: AddEditTestReportPage,
    roles: ['admin', 'sales', 'accounts', 'stores', 'quality']

  },
  // {
  //   path: "/test/params",
  //   name: "Test Parameters",
  //   mini: "TP",
  //   component: TestParamsListPage
  // },
  // {
  //   subpage: true,
  //   path: "/test/params-edit/:testparamscode",
  //   name: "Add/Edit Test Parameter",
  //   component: AddEditTestParamsPage
  // },
  {
    path: "/test/cases",
    name: "Manage Test Cases",
    mini: "TC",
    component: TestCaseListPage,
    roles: ['admin', 'sales', 'accounts', 'quality']
  },
  {
    subpage: true,
    path: "/test/cases-edit/:testcasescode",
    name: "Add/Edit Test Case",
    component: AddEditTestCasePage,
    roles: ['admin', 'sales', 'accounts', 'quality']
  },
  {
    path: "/test/material",
    name: "Test Material",
    mini: "TM",
    component: TestMaterialListPage,
    roles: ['admin', 'sales', 'accounts', 'stores', 'quality']
  },
  {
    subpage: true,
    path: "/test/material-edit/:testmaterialcode",
    name: "Add/Edit Test Material",
    component: AddEditTestMaterialPage,
    roles: ['admin', 'sales', 'accounts', 'stores', 'quality']
  },
  // {
  //   path: "/test/reinforcement",
  //   name: "Reinforcement Steel Report",
  //   mini: "RSR",
  //   component: TestReportListPage
  // },
  // {
  //   path: "/test/handbrokenmetalreport",
  //   name: "Hand Broken Metal Report",
  //   mini: "RSR",
  //   component: HandMetalListPage
  // },
  // {
  //   path: "/test/concretecubereport",
  //   name: "Concrete Cube Report",
  //   mini: "CCR",
  //   component: ConcreteCubeListPage
  // },

]

export default testMgmtRoutes;