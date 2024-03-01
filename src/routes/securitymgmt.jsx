import NoFeaturePage from "views/Errors/NoFeature.jsx";

var securitymgmt = [
  {
    path: "/securitymgmt/security",
    name: "Security Management",
    mini: "SM",
    component: NoFeaturePage
  },
  {
    subpage: true,
    path: "/securitymgmt/security-edit/:code",
    name: "Add/Update Security Management",
    component: NoFeaturePage
  },
 
]

export default securitymgmt;