var usersData = [
  { code: "", firstName: "", middleName: "", lastName: "", email: "", address: "", city: "", state: "", zipcode: "", phone: "", role: "", image: "" },
  { code: "E001", firstName: "Suyog", middleName: "U", lastName: "Patil", email: "suyogupatil@gmail.com", address: "Pune", city: "Pune", state: "Maharashtra", zipcode: "411033", phone: "12345", role: "Admin", image: "" },
  { code: "E002", firstName: "Kimaya", middleName: "S", lastName: "Patil", email: "kimayasp@gmail.com", address: "Pune", city: "Pune", state: "Maharashtra", zipcode: "411033", phone: "12345", role: "Admin", image: "" }
];
const employee =
{
  "_id": "5d370bf0d9c49b40c4ec10ab",
  "department": "It",
  "documents": [],
  "active": true,
  "name": "A B N Interarchpvt Ltd",
  "city": "pune",
  "state": "AS",
  "email": "patil.crane@gmail.com",
  "phone": "5562333244",
  "gender": "Male",
  "photo": "",
  "birthDate": null,
  "designation": "sdfg",
  "supervisor": "5ced279579f5040c4de3686a",
  "level": 1,
  "personalDetails": {
    "emergencyName": "",
    "emergencyContact": "",
    "nominy": "",
    "spouse": "",
    "bloodGroup": "B-"
  },
  "prevEmployer": {
    "companyName": "sss",
    "prevEmpAddress": "",
    "designation": "",
    "joiningDate": null,
    "releavingDate": null
  },
  "bankDetails": {
    "bankName": "",
    "accountNo": "",
    "ifscCode": "",
    "panNo": "",
    "adharNo": ""
  },
  "userRef": "5d370bf0d9c49b40c4ec10aa",
  "number": "1920/EMP/2",
  "user": "5cb0575f3be0e64ac5bd1aeb",
  "createdAt": "2019-07-23T13:30:24.503Z",
  "updatedAt": "2019-07-24T12:58:25.789Z",
  "code": 38,
  "__v": 1,
  "leaves": [
    {
      "_id": '5cb0575f3be0e64ac5bd1aeb',
      "leaveType": {
        "_id": "5d38379f916b603414c8669d",
        "active": true,
        "deletedAt": "2019-07-24T11:41:53.293Z",
        "code": 25,
        "leaveType": "EARNED LEAVE",
        "totalLeaves": 10,
        "number": "1920/LEVTYP/1",
        "createdBy": "5cb0575f3be0e64ac5bd1aeb",
        "user": "5cb0575f3be0e64ac5bd1aeb",
        "createdAt": "2019-07-24T10:49:03.349Z",
        "updatedAt": "2019-07-24T11:41:53.296Z",
        "__v": 0,
        "deletedBy": "5cb0575f3be0e64ac5bd1aeb"
      },
      "isApllicable": true,
      "balance": 10
    },
    {
      "_id": "5d384525b0afa00d78751589",
      "leaveType": {
        "_id": "5d384525b0afa00d78751588",
        "active": true,
        "deletedAt": null,
        "code": 29,
        "leaveType": "SICK LEAVES",
        "totalLeaves": 10,
        "number": "1920/LEVTYP/5",
        "createdBy": "5cb0575f3be0e64ac5bd1aeb",
        "user": "5cb0575f3be0e64ac5bd1aeb",
        "createdAt": "2019-07-24T11:46:45.687Z",
        "updatedAt": "2019-07-24T11:46:45.687Z",
        "__v": 0
      },
      "isApllicable": true,
      "balance": 10
    }
  ]
}
const myWorklist = [{
  id: "1234",
  nameOfApplicant: "adf",
  typeOfLeave: "asdg",
  startDate: "ashh",
  endDate: "scd",
  noOfDays: "sdsd",
}, {
  id: "1235",
  nameOfApplicant: "adf",
  typeOfLeave: "asdg",
  startDate: "ashh",
  endDate: "scd",
  noOfDays: "sdsd",
}]
module.exports = {
  usersData,
  myWorklist,
  employee
}