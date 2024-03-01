
//local ul
var encdec = "yn$z-wu3BcJ35R#RJ5rja%wv!5BWYUcE6gU88$9?mxdN5vjF5*Xamz3GYcPq-JqpjJe+zN!Xwr8x3XVEa$Y=T#8$c*!gCmtF3*EPD!-Ge-!B$ZdbWGcgA%xqJa6RcCajxBf8WyVb$C9$WN_4yCUUJ_!!97mPSxmMTGgK$jALPnXTg@4mS#jZG6WUZh?!x&HU&wawqEjgS_PKryLF8nw4=V@@fXTpXEz_U9Q$$tF?RH^yBpA^ArjLjM9L97xQ!bfA";
var socketIoServer = "http://192.168.0.7:4000"
//producation url

// var encdec = "qgjpfnzvxhxmnmjoifqxdyljboxvniwdxeximncknzbxwvpjegnpmgzbysxospllbfehzzmrximosnqnipsjdjmcgyaaavbqiiy"
// var socketIoServer = "https://arrowsofterp.com:2001"
//var socketIoServer = "https://test.arrowsofterp.com"
var backendURL = socketIoServer + "/api/admin/";
var version = "3.2";


const paginationLabels = {
  first: '«',
  last: '»',
  previous: '‹',
  next: '›'
};
const paginationStylesList = {
  ul: {
    padding: "15px"
  },
  next: { display: "none" },
  previous: { display: "none" }
}

const paginationStylesForm = {
  ul: {
    padding: "0px"
  },
  next: { display: "none" },
  previous: { display: "none" }
}

const stateList =
  [{ value: "AN", label: "Andaman and Nicobar Islands" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "AR", label: "Arunachal Pradesh" },
  { value: "AS", label: "Assam" },
  { value: "BR", label: "Bihar" },
  { value: "CG", label: "Chandigarh" },
  { value: "CH", label: "Chhattisgarh" },
  { value: "DH", label: "Dadra and Nagar Haveli" },
  { value: "DD", label: "Daman and Diu" },
  { value: "DL", label: "Delhi" },
  { value: "GA", label: "Goa" },
  { value: "GJ", label: "Gujarat" },
  { value: "HR", label: "Haryana" },
  { value: "HP", label: "Himachal Pradesh" },
  { value: "JK", label: "Jammu and Kashmir" },
  { value: "JH", label: "Jharkhand" },
  { value: "KA", label: "Karnataka" },
  { value: "KL", label: "Kerala" },
  { value: "LD", label: "Lakshadweep" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "MN", label: "Manipur" },
  { value: "ML", label: "Meghalaya" },
  { value: "MZ", label: "Mizoram" },
  { value: "NL", label: "Nagaland" },
  { value: "OR", label: "Odisha" },
  { value: "PY", label: "Puducherry" },
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "SK", label: "Sikkim" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TS", label: "Telangana" },
  { value: "TR", label: "Tripura" },
  { value: "UK", label: "Uttarakhand" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "WB", label: "West Bengal" }
  ]


const selectOptionsMaintenaceStatus = [
  { value: "Active", label: "Active" },
  { value: "Planned", label: "Planned" },
  { value: "Out", label: "Out" },
  { value: "Loss", label: "Loss" },
  { value: "Damage", label: "Damage" },
  { value: "Salvaged", label: "Salvaged" },
  { value: "inMaintenance ", label: " In Maintenance " },


]
const selectOptionsDataTypes = [
  { value: "Number", label: "Number" },
  { value: "Text", label: "Text" },
  { value: "Boolean", label: "Boolean" }
]
var selectOptionsUserRoles = [

  { value: "admin", label: "Admin" },
  { value: "sales", label: "Sales" },
  { value: "accounts", label: "Accounts" },
  { value: "dispatch", label: "Dispatch" },
  { value: "stores", label: "Stores" },
  { value: "quality", label: "Quality" },
  { value: "purchase", label: "Purchase" },
  { value: "security", label: "Security" },
  { value: "hr", label: "HR" },
  { value: "driver", label: "Driver" },
];
const invTypes = [
  { value: "Asset", label: "Asset" },
  // { value: "Product", label: "Product" },
  { value: "Service", label: "Service" },
  { value: "Store", label: "Store" },
  // { value: "Consumable", label: "Consumable" },
]
const unitList = [
  { value: "CuM", label: "CuM" },
  { value: "MT", label: "MT" },
  { value: "BAG", label: "BAG" },
  { value: "LTR", label: "LTR" },
  { value: "KG", label: "KG" },
  { value: "NOS", label: "NOS" },
  { value: "NOS", label: "NOS" },
]

const gender = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" }
];
const bloodGroup = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" }
];
const maritalStatus = [
  { label: "Married", value: "Married" },
  { label: "Unmarried", value: "Unmarried" },
  { label: "Divorced", value: "Divorced" },
];
const policyList = [
  { value: "A", label: "Auto" },
  { value: "M", label: "Manual" }
];
const listOfFrequency = [
  { label: "Monthly", value: "M" },
  { label: "Quarterly", value: "Q" },
  { label: "Half Yearly", value: "H" },
  { label: "Yearly", value: "Y" }
];
const listofReimbursementType = [
  { label: "Travel Expense", value: "Travel" },
  { label: "Medical Expense", value: "Medical" },
  { label: "Petrol Expense", value: "Petrol" },
  { label: "Business Expense", value: "Business" }
];
const paymentModes = [
  { show: true, value: 'Credit', label: 'Credit' },
  { show: true, value: 'Advance Payment', label: 'Advance Payment' },
  { show: true, value: 'Partial Advance Payment', label: 'Partial Advance Payment' },
  { show: true, value: 'Cash on Delivery', label: 'Cash on Delivery' },
  { show: true, value: 'Cash on Collection', label: 'Cash on Collection' }
]
var pageSizeOptionsList = [10, 25, 50, 100]
var defaultPageSize = [25]

module.exports = {
  // serverConfig,
  version,
  encdec,
  backendURL,
  stateList,
  invTypes,
  unitList,
  paginationLabels,
  paginationStylesList,
  socketIoServer,
  selectOptionsMaintenaceStatus,
  selectOptionsUserRoles,
  paginationStylesForm,
  selectOptionsDataTypes,
  pageSizeOptionsList,
  defaultPageSize,
  maritalStatus,
  policyList,
  listOfFrequency,
  listofReimbursementType,
  paymentModes

}