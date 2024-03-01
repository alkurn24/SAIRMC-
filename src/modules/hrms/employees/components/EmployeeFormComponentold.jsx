import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import Moment from "moment";
import Datetime from "react-datetime";
import { FormGroup, ControlLabel, FormControl, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";
import cookie from 'react-cookies';
import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import PayrollComponent from '../components/PayrollComponent.jsx'
import ContactsListComponent from 'modules/common/contacts/components/ContactsListComponent.jsx';
import AddressesListComponent from 'modules/common/addresses/components/AddressesListComponent.jsx';
import { getDesignationList } from "../server/OrgchartServerComm.jsx"
import { createEmployee, updateEmployee, deleteEmployee, getEmployeeSingle } from "../server/EmployeeServerComm.jsx";
import { stateList, errorColor, bloodGroup, maritalStatus } from 'variables/appVariables.jsx';
import { getSupervisorList } from "../server/HrmsServerComm.jsx";


class EmployeeFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // payrollData: [],
      settings: props.settings,
      edit: !props.settings,
      employeeList: [],
      leaveTypeList: "",
      userList: [],
      listOfDesignation: [],
      supervisorList: [],
      employee: props.employee
        ? props.employee
        : {
          code: null,
          name: "",
          city: "",
          state: "",
          email: "",
          phone: "",
          gender: null,
          joiningDate: null,
          photo: "",
          birthDate: null,
          designation: "",
          department: "",
          leaves: [],
          supervisor: "",
          _parent: props._parent ? props._parent.node.id : null,
          // customer: props.customer.id,
          personalDetails: {
            emergencyName: "",
            emergencyContact: "",
            nominy: "",
            spouse: "",
            bloodGroup: "",
            maritalStatus: "",
            address: ""
          },
          prevEmployer: {
            companyName: '',
            prevEmpAddress: "",
            designation: "",
            joiningDate: null,
            releavingDate: null
          },
          bankDetails: {
            bankName: "",
            accountNo: "",
            ifscCode: "",
            panNo: "",
            adharNo: "",
          },
          imagePreviewUrl: "",
          documents: []
        },
      nameError: false,
      emailError: false,
      cityError: false,
      stateError: false,
      genderError: false,
      phoneError: false,
      birthDateError: false,
      supervisorError: false,
      designationError: false,
      genderError: false,
      nameValid: null,
      cityValid: null,
      stateValid: null,
      genderValid: null,
      phoneValid: null,
      birthDateValid: null,
      supervisorValid: null,
      designationValid: null,
      genderValid: null,
      emailValid: null,
      isAlart: false,
      alart: { message: "" },
    }
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  componentWillMount() {
    var _this = this;
    getDesignationList("view=supervisor",
      function success(listOfDesignation) {
        _this.setState({ listOfDesignation })
      },
      this.error
    )
    getSupervisorList("view=supervisor",
      function success(supervisorList) {
        _this.setState({ supervisorList })
      },
      this.error
    )
    if (this.state.employee.code !== null || _this.props.match.params.code !== undefined) {
      if (_this.props.match.params.code !== 'new') {
        getEmployeeSingle(_this.props.match.params.code || this.state.employee.code,
          (res) => {
            let tempEmployee = JSON.parse(JSON.stringify(res))
            tempEmployee.code = tempEmployee.code;
            tempEmployee.brithDate = Moment(tempEmployee.brithDate);
            tempEmployee.supervisor = tempEmployee.supervisor ? tempEmployee.supervisor.id : "";
            tempEmployee.prevEmployer.joiningDate = tempEmployee.prevEmployer.joiningDate ? Moment(tempEmployee.prevEmployer.joiningDate) : null;
            tempEmployee.prevEmployer.releavingDate = tempEmployee.prevEmployer.releavingDate ? Moment(tempEmployee.prevEmployer.releavingDate) : null;
            // getPayrollData(tempEmployee.id, this.setPayrollHeadsData, this.error);
            _this.setState({ employee: tempEmployee })
          },
          this.error
        )
      }
    }

  }
  // setPayrollHeadsData = (payrollData) => {
  //   this.setState({ payrollData })
  // }
  error = err => {
    this.setState({
      isAlart: true,
      alart: {
        onConfirm: () => this.setState({ isAlart: false }),
        cancelBtnBsStyle: "danger",
        confirmBtnText: "OK",
        showCancel: false,
        message: `Something went wrong!`,
        error: true
      }
    })
    console.log("err :", err);
  }
  delete() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm()}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this employee!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteEmployee(_this.state.customer.code,
      function success(data) {
        _this.props.history.push("/hrms/employees");
      },
      function error(code) {
        _this.errorAlert("Error in deleting employee.");
      }
    )
  }
  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => { this.props.history.push("/hrms/employees/"); this.setState({ alert: null }) }}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  errorAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          error
          style={{ display: "block", marginTop: "-100px" }}
          title={message}
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }


  validationCheck() {
    this.state.employee.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    this.state.employee.designation === "" ?
      this.setState({ designationError: "Enter designation", designationValid: false }) :
      this.setState({ designationError: "", designationValid: true })
    this.state.employee.supervisor === null ?
      this.setState({ supervisorError: "select supervisor", supervisorValid: false }) :
      this.setState({ supervisorError: "", supervisorValid: true })
    this.state.employee.brithDate === null ?
      this.setState({ birthDateError: "Enter brithdate", birthDateValid: false }) :
      this.setState({ birthDateError: "", birthDateValid: true })
    this.state.employee.gender === null ?
      this.setState({ genderError: "select gender", genderValid: false }) :
      this.setState({ genderError: "", genderValid: true })
    this.state.employee.email === "" ?
      this.setState({ emailError: "enter email", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    this.state.employee.city === "" ?
      this.setState({ cityError: "Enter city Name", cityValid: false }) :
      this.setState({ cityError: "", cityValid: true })
    this.state.employee.state === "" ?
      this.setState({ stateError: "Enter state Name", stateValid: false }) :
      this.setState({ stateError: "", stateValid: true })
    this.state.employee.email === "" ?
      this.setState({ emailError: "Enter state Name", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    this.state.employee.phone === "" ?
      this.setState({ phoneError: "Enter contact no", phoneValid: false }) :
      this.setState({ phoneError: "", phoneValid: true })


    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempEmployee = JSON.parse(JSON.stringify(this.state.employee))
    tempEmployee.email = tempEmployee.email.toLowerCase();
    delete tempEmployee.payroll;
    if (_this.state.nameValid && _this.state.cityValid && _this.state.stateValid
      && _this.state.supervisorValid && _this.state.birthDateValid && _this.state.phoneValid && _this.state.designationValid && _this.state.genderValid)
      if (tempEmployee.code === null) {
        delete tempEmployee.code,
          createEmployee(tempEmployee,
            function success(data) {
              _this.successAlert("Employee added successfully!", true);
            },
            function error(res) {
              if (res.message === 'Request failed with status code 701') {
                _this.errorAlert("Duplicate employee name");
              }
              else {
                _this.errorAlert("Something went wrong!")
              }
            }
          )
      }
      else {
        updateEmployee(tempEmployee,
          function success() {
            _this.successAlert("Employee saved successfully!");
          },
          function error() {
            _this.errorAlert("Error in saving employee.");
          }
        )

      }
    else {
      _this.setState({ formError: "Please enter required fields" })

    }

  }
  handleDateChange(name, date) {
    var moduleTemp = this.state.employee;
    moduleTemp[name] = date._d;
    this.setState({ moduleTemp });
  }
  handleDropDownChange(selectOption, type) {
    var newEmployee = this.state.employee;
    newEmployee[type] = selectOption ? selectOption.value : null;
    this.setState({ employee: newEmployee });
  }
  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }
  handleImageChange(img) {
    var employee = this.state.employee;
    employee.photo = img;
    this.setState({ employee });
  }
  handleMultipleDocumentChange(newDocument) {
    var employee = this.state.employee;
    employee.documents = newDocument.documents;
    this.setState({ employee });
  }
  handleDeleteDocument(key) {
    let employee = this.state.employee;
    employee.documents.slice();
    employee.documents.splice(key, 1);
    this.setState({ employee });
  }
  handleInputChangePersonal(e) {
    var newObj = this.state.employee.personalDetails;
    newObj[e.target.name] = e.target.value;
    this.setState({ newObj });

  }
  handleInputChange = (e) => {
    var newObj = this.state.employee;
    if (e.target.name === "phone") {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ employee: newObj });
      }
      else {
        return null;
      }
    }
    // if (e.target.name === "email") {
    //   var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //   if (e.target.value === '' || re.test(e.target.value)) {
    //     this.setState({ customer: newObj });
    //   }
    //   else {
    //     return null;
    //   }
    // }
    if (e.target.name.indexOf("custom_") !== -1) {
      var key = parseInt(e.target.name.split("_")[1], 10);
      newObj.custom[key] = e.target.value;
      this.setState({ employee: newObj });
    } else if (e.target.name.indexOf("radio_") !== -1) {
      newObj[e.target.name.split("_")[1]] = e.target.value;
      this.setState({ employee: newObj });
    } else {
      newObj[e.target.name] = e.target.value;
      this.setState({ employee: newObj });
    }
  }
  handleAddressChange = (e) => {
    let newObj = this.state.employee;
    let addr = e.target.name.split("_")[0];
    let field = e.target.name.split("_")[1];
    newObj[addr][field] = e.target.value;
    this.setState({ employee: newObj });
  }

  handleCheckedChange(e) {
    var newObj = this.state.employee;
    newObj[e.target.name] = e.target.checked;
    this.setState({ newObj });
  }
  render() {
    const Back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const List = (<Tooltip id="delete_tooltip">Employee list</Tooltip>);
    let form = (
      // <Row>
      <div>
        {/* <Col xs={12} sm={12} md={this.state.code.code ? 2 : 0} lg={2}>
          <UploadComponent
            picture
            type="employees"
            photo={this.state.employee.photo}
            details={this.state.employee}
            handleImageChange={this.handleImageChange}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          {this.state.employee.code !== null ?

            <Col xs={12} sm={4} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Emp Code : &nbsp;&nbsp;{cookie.load('username')}</ControlLabel>
              </FormGroup>
            </Col>
            : null
          }
          {this.state.employee.code !== null ?
            (
              <Col xs={12} sm={4} md={3} lg={3}>
                <FormGroup>
                  <ControlLabel>Created by: {this.state.employee.user ? this.state.employee.user.name : ""}</ControlLabel>
                </FormGroup>
              </Col>
            ) : null
          }
          {this.state.employee.code !== null ?
            (
              <Col xs={12} sm={6} md={4} lg={3}>
                <FormGroup>
                  <ControlLabel>Date And Time: {this.state.employee.createdAt ? Moment(this.state.employee.createdAt).format("DD MMM YYYY hh:mm:ss A") : null}</ControlLabel>
                </FormGroup>
              </Col>
            ) : null
          }
        </Col> */}
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Name <span className="star">*</span> </ControlLabel>
              <FormControl
                name="name"
                type="text"
                placeholder="Employee name"
                value={this.state.employee.name}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>supervisor<span className="star">*</span></ControlLabel>
              <Select
                clearable={false}
                placeholder="Select supervisor"
                name="supervisor"
                value={this.state.employee.supervisor ? this.state.employee.supervisor : ''}
                options={this.state.supervisorList}
                onChange={(selectOption) => this.handleDropDownChange(selectOption, "supervisor")}
                style={{ color: this.state.supervisorValid || this.state.supervisorValid === null ? "" : errorColor, borderColor: this.state.supervisorValid || this.state.supervisorValid === null ? "" : errorColor }}

              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel> State / Region  <span className="star">*</span> </ControlLabel>
              <Select
                clearable={false}
                placeholder="Select state/region"
                name="state"
                value={this.state.employee.state}
                options={stateList}
                onChange={(option) => {
                  let tempObj = this.state.employee;
                  tempObj.state = option ? option.value : null;
                  this.setState({ tempObj })
                }}
                style={{ color: this.state.stateValid || this.state.stateValid === null ? "" : errorColor, borderColor: this.state.stateValid || this.state.stateValid === null ? "" : errorColor }}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>City<span className="star">*</span></ControlLabel>
              <FormControl
                name="city"
                type="text"
                maxLength="30"
                placeholder="Enter city"
                value={this.state.employee.city}
                onChange={this.handleInputChange}
                className={this.state.cityValid || this.state.cityValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Primary EMail<span className="star">*</span> </ControlLabel>
              <FormControl
                name="email"
                type="email"
                placeholder="Enter email"
                value={this.state.employee.email}
                onChange={this.handleInputChange}
                className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}

              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Primary Phone <span className="star">*</span></ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">+91</span>
                <FormControl
                  name="phone"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="Enter phone number"
                  value={this.state.employee.phone}
                  onChange={this.handleInputChange}
                  className={this.state.phoneValid || this.state.phoneValid === null ? "" : "error"}

                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Gender <span className="star">*</span></ControlLabel>
              <Select
                clearable={false}
                placeholder="Select gender"
                name="gender"
                value={this.state.employee.gender}
                options={
                  [
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]
                }
                onChange={(selectOption) => {
                  var tempGender = this.state.employee;
                  tempGender.gender = selectOption.value;
                  this.setState({ tempGender });
                }}
                style={{ color: this.state.genderValid || this.state.genderValid === null ? "" : errorColor, borderColor: this.state.genderValid || this.state.genderValid === null ? "" : errorColor }}

              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>date of birth<span className="star" >*</span></ControlLabel>
              <Datetime
                timeFormat={false}
                closeOnSelect={true}
                dateFormat="DD MMM YYYY"
                name="birthDate"
                inputProps={{ placeholder: "Select birth date", style: { color: this.state.birthDateValid || this.state.birthDateValid === null ? "" : errorColor, borderColor: this.state.birthDateValid || this.state.birthDateValid === null ? "" : errorColor } }}
                value={this.state.employee.brithDate ? Moment(this.state.employee.brithDate).format("DD MMM YYYY") : null}
                onChange={(date) => this.handleDateChange("brithDate", date)}
              />
            </FormGroup>
          </Col>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>DEPARTMENT </ControlLabel>
              <FormControl
                name="department"
                type="text"
                placeholder="Enter department"
                value={this.state.employee.department}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>DESIGNATION <span className="star">*</span></ControlLabel>
              <Select
                clearable="false"
                placeholder="Select designation"
                value={this.state.employee.designation}
                options={this.state.listOfDesignation}
                onChange={(selectOption) => {
                  const tempObj = this.state.employee;
                  tempObj.designation = selectOption.value;
                  this.setState({ tempObj });
                }}
                style={{ color: this.state.designationValid || this.state.designationValid === null ? "" : errorColor, borderColor: this.state.designationValid || this.state.designationValid === null ? "" : errorColor }}
              />
            </FormGroup>
          </Col>
          {/* <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>DESIGNATION<span className="star">*</span> </ControlLabel>
              <FormControl
                name="designation"
                type="text"
                placeholder="Enter designation"
                value={this.state.employee.designation}
                onChange={this.handleInputChange}
                className={this.state.designationValid || this.state.designationValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col> */}
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Joining Date</ControlLabel>
              <Datetime
                timeFormat={false}
                closeOnSelect={true}
                inputProps={{ placeholder: "Enter joining date" }}
                dateFormat="DD MMM YYYY"
                value={this.state.employee.joiningDate ? Moment(this.state.employee.joiningDate).format("DD MMM YYYY") : null}
                onChange={(date) => this.handleDateChange("joiningDate", date)}
              />
            </FormGroup>
          </Col>
          {/* {this.state.employee.level === 1 ? null : */}
          {/* <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Parent</ControlLabel>
              <Select
                clearable={false}
                placeholder="Select parent"
                name="_parent"
                value={this.state.employee._parent ? this.state.employee._parent : null}
                options={this.state.supervisorList}
                onChange={(selectOption) => this.handleDropDownChange(selectOption, "_parent")}
              />
            </FormGroup>
          </Col> */}
        </Col>
        <Col xs={12}>
          <div>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Tab.Container id="customer-details" defaultActiveKey="personal">
                {/* <Tab.Container id="customer-details" defaultActiveKey="personal"> */}
                <Row className="clearfix">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Nav bsStyle="tabs">
                      <NavItem eventKey="personal" className=""> Personal Details</NavItem>
                      <NavItem eventKey="preEmployee" className=""> Previous Employer</NavItem>
                      <NavItem eventKey="bankDetail" className="text-center"><i className="" />Bank Details</NavItem>
                      {this.state.employee.code !== null ?
                        < NavItem eventKey="addresses" className="text-center"><i className="" />Addresses</NavItem>
                        : null
                      }
                      {/* {this.state.employee.code !== null ?
                        <NavItem eventKey="contacts" className="text-center"><i className="" />Contacts</NavItem>
                        : null
                      } */}
                      {this.state.employee.code !== null ?
                        <NavItem eventKey="documents" className=" "> Documents</NavItem>
                        : null
                      }
                      {this.state.employee.code !== null ?
                        <NavItem eventKey="payroll" className=" "> Payroll</NavItem>
                        : null
                      }
                    </Nav>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Tab.Content animation>
                      <Tab.Pane eventKey="personal">
                        <Row>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel> Emergency Contact Name </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter name"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.emergencyName : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.personalDetails.emergencyName = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Emergency Contact Number </ControlLabel>
                              <span className="input-group">
                                <span className="input-group-addon">+91</span>
                                <FormControl
                                  name="emergencyName"
                                  type="text"
                                  minLength={10}
                                  maxLength={10}
                                  placeholder="Enter phone number"
                                  value={this.state.employee.personalDetails ? this.state.employee.personalDetails.emergencyContact : ""}
                                  onChange={(e) => {
                                    const re = /^[0-9\b]+$/;
                                    let tempObj = this.state.employee;
                                    if (e.target.value === '' || re.test(e.target.value)) {
                                      tempObj.personalDetails.emergencyContact = e.target.value;
                                    }
                                    this.setState({ tempObj })
                                  }}
                                />
                              </span>
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel> Blood Group </ControlLabel>
                              <Select
                                options={bloodGroup}
                                placeholder="Select blood group"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.bloodGroup : ""}
                                onChange={(option) => {
                                  let tempObj = this.state.employee;
                                  tempObj.personalDetails.bloodGroup = option ? option.value : null;
                                  this.setState({ tempObj })
                                }}
                              />
                            </FormGroup>
                          </Col>

                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Nominy </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter nominy"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.nominy : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.personalDetails.nominy = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Marital Status </ControlLabel>
                              <Select
                                options={maritalStatus}
                                placeholder="Select marital status"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.maritalStatus : null}
                                // onChange={(selectOption) => this.handleDropDownChange(selectOption, "personalDetails.maritalStatus")}
                                onChange={(option) => {
                                  let tempObj = this.state.employee;
                                  tempObj.personalDetails.maritalStatus = option ? option.value : null;
                                  this.setState({ tempObj })
                                }}
                              />
                            </FormGroup>
                          </Col>
                          {this.state.employee.personalDetails ?
                            this.state.employee.personalDetails.maritalStatus === "Married" ?
                              <Col xs={12} sm={4} md={3} lg={3}>
                                <FormGroup>
                                  <ControlLabel>Spouse </ControlLabel>
                                  <FormControl
                                    type="text"
                                    placeholder="Enter spouse"
                                    value={this.state.employee.personalDetails ? this.state.employee.personalDetails.spouse : ""}
                                    onChange={(e) => {
                                      let tempObj = this.state.employee;
                                      tempObj.personalDetails.spouse = e.target.value;
                                      this.setState({ tempObj });
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              : null
                            : null
                          }
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="preEmployee">
                        <Row>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel> Company Name  </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter company name"
                                value={this.state.employee.prevEmployer ? this.state.employee.prevEmployer.companyName : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.prevEmployer.companyName = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Designation </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter designation"
                                value={this.state.employee.prevEmployer ? this.state.employee.prevEmployer.designation : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.prevEmployer.designation = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Joining Date </ControlLabel>
                              <Datetime
                                timeFormat={false}
                                closeOnSelect={true}
                                dateFormat="DD MMM YYYY"
                                inputProps={{ placeholder: "Enter joining date" }}
                                value={this.state.employee && this.state.employee.prevEmployer.joiningDate ? Moment(this.state.employee.prevEmployer.joiningDate).format("DD MMM YYYY") : ""}
                                onChange={(e) => {
                                  var tempObj = this.state.employee;
                                  tempObj.prevEmployer.joiningDate = e._d;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Releaving Date </ControlLabel>
                              <Datetime
                                timeFormat={false}
                                closeOnSelect={true}
                                dateFormat="DD MMM YYYY"
                                name="poDate"
                                inputProps={{ placeholder: "Enter releaving date" }}
                                value={this.state.employee && this.state.employee.prevEmployer.releavingDate ? Moment(this.state.employee.prevEmployer.releavingDate).format("DD MMM YYYY") : ""}
                                onChange={(e) => {
                                  var tempObj = this.state.employee;
                                  tempObj.prevEmployer.releavingDate = e._d;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <FormGroup>
                              <ControlLabel>Address</ControlLabel>
                              <FormControl
                                componentClass="textarea"
                                type="text"
                                name="address"
                                rows={3}
                                placeholder="Enter address"
                                value={this.state.employee.prevEmployer ? this.state.employee.prevEmployer.prevEmpAddress : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.prevEmployer.prevEmpAddress = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="bankDetail">
                        <Row>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Bank Name</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter bank name"
                                value={this.state.employee.bankDetails ? this.state.employee.bankDetails.bankName : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.bankDetails.bankName = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Bank Accout Number</ControlLabel>
                              <FormControl
                                type="number"
                                placeholder="Enter bank accout number"
                                value={this.state.employee.bankDetails ? this.state.employee.bankDetails.accountNo : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.bankDetails.accountNo = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>IFSC Code </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter IFSC code"
                                value={this.state.employee.bankDetails ? this.state.employee.bankDetails.ifscCode : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.bankDetails.ifscCode = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>

                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>PAN card Number </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter PAN number"
                                value={this.state.employee.bankDetails ? this.state.employee.bankDetails.panNo : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.bankDetails.panNo = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Adhar Card Number</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter adhar card number"
                                value={this.state.employee.bankDetails ? this.state.employee.bankDetails.adharNo : ""}
                                onChange={(e) => {
                                  let tempObj = this.state.employee;
                                  tempObj.bankDetails.adharNo = e.target.value;
                                  this.setState({ tempObj });
                                }}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      {/* <Tab.Pane eventKey="contacts">
                        <Col xs={12}>
                          <Row>
                            <ContactsListComponent view="employee" employeeId={this.state.employee.id} {...this.props} />
                          </Row>
                        </Col>
                      </Tab.Pane> */}
                      <Tab.Pane eventKey="addresses">
                        <Col xs={12}>
                          <Row>
                            <AddressesListComponent view="employee" employeeId={this.state.employee.id} {...this.props} />
                          </Row>
                        </Col>
                      </Tab.Pane>
                      <Tab.Pane eventKey="documents">
                        <Row>
                          <UploadComponent
                            document
                            type="employees"
                            documents={this.state.employee.documents}
                            details={this.state.employee}
                            dropText="Drop files or click here"
                            handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                            handleDeleteDocument={this.handleDeleteDocument}
                          />
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="payroll">
                        <Col xs={12}>
                          <Row>
                            <PayrollComponent view="payroll"
                              // payrollData={this.state.payrollData} 
                              employee={this.state.employee} {...this.props} />
                          </Row>
                        </Col>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Col>
          </div>

        </Col>
      </div >
    )
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        {this.props.match.url !== "/hrms/employees" ?
          <OverlayTrigger placement="top" overlay={Back}>
            <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
          </OverlayTrigger>
          : null
        }
        {this.props.match.url !== "/hrms/employees" ?
          <OverlayTrigger placement="top" overlay={List} style={{ backgroundColor: "red" }}>
            <Button bsStyle="primary" fill icon disabled={this.state.settings} onClick={() => { return this.props.history.push("/hrms/employees/list"); }}> <span className="fa fa-list"></span>
            </Button>
          </OverlayTrigger>
          : null
        }
        < OverlayTrigger placement="top" overlay={Save}>
          <Button bsStyle="success" fill pullRight icon tooltip="Save" onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    );
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form ">{form}</div>
        <div className="card-footer">{actions}</div>
        <SweetAlert
          show={this.state.isAlart} style={{ display: "block", marginTop: "-100px" }}
          onCancel={() => this.setState({ isAlart: false })}
          onConfirm={() => this.setState({ isAlart: false })}
          title=''
          {...this.state.alart}>
          {this.state.alart.message}
        </SweetAlert>
      </Row>
    )
  }
}

export default EmployeeFormComponent;