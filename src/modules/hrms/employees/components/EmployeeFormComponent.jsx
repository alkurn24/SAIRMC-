import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "components/CustomSelect/CustomSelect.jsx";
import Moment from "moment";
import Datetime from "react-datetime";
import { FormGroup, ControlLabel, FormControl, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import PayrollComponent from '../components/PayrollComponent.jsx'
import AddressesListComponent from 'modules/common/addresses/components/AddressesListComponent.jsx';
import { getDesignationList } from "../server/OrgchartServerComm.jsx"
import { createEmployee, updateEmployee, getEmployeeSingle, getParentDesignation } from "../server/EmployeeServerComm.jsx";
import { stateList, errorColor, bloodGroup, maritalStatus } from 'variables/appVariables.jsx';
import { getSupervisorList } from "../server/HrmsServerComm.jsx";

class EmployeeFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRoot: false,
      employeeList: [],
      leaveTypeList: "",
      userList: [],
      parentDesignation: [],
      listOfDesignation: [],
      supervisorList: [],
      formError: null,
      employee: {
        code: "new",
        title: "Mr.",
        photo: "",
        title: "",
        personalDetails: "",
        prevEmployer: "",
        bankDetails: ""
      },
      nameValid: null,
      supervisorValid: null,
      stateValid: null,
      cityValid: null,
      emailValid: null,
      phoneValid: null,
      genderValid: null,
      birthDateValid: null,
      designationValid: null,
      _parentValid: null,
      isAlart: false,
      alart: { message: "" },
    }
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  componentWillMount() {
    getDesignationList("view=supervisor", (temp) => {
      let isRoot = false;
      let listOfDesignation = [];
      const root = temp.find(el => !!el.root);
      if (this.props.match.params.code !== "new") {
        getEmployeeSingle(this.props.match.params.code,
          (employee) => {
            if (employee.designation) {
              if (employee.designation.toString() === root.value.toString()) {
                isRoot = true;
                listOfDesignation.push(root);
              } else {
                const opt = temp.find(el => employee.designation.toString() === el.value)
                opt ? getParentDesignation(opt._parent, this.setMultiDesignation, this.error) : null
                listOfDesignation = temp.filter(el => !el.root)
              }
            } else {
              listOfDesignation = temp.filter(el => !el.root)
            }
            this.setState({ employee, listOfDesignation, isRoot })
          }, this.error)
      } else {
        listOfDesignation = temp.filter(el => !el.root)
        this.setState({ listOfDesignation })
      }
    }, this.error)
    getSupervisorList("view=supervisor", (supervisorList) => this.setState({ supervisorList }), this.error)
  }
  // handleSetParent = res => {
  //   this.setState({ parentDesignation })
  // }
  success = message => {
    this.setState({
      isAlart: true,
      alart: {
        onConfirm: () => this.props.history.push("/hrms/employees/list"),
        title: "Successful",
        cancelBtnBsStyle: "success",
        confirmBtnText: "OK",
        cancelBtnText: "Cancel",
        showCancel: false,
        message,
        confirmBtnBsStyle: "success",
        success: true
      }
    })
  }
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
  handleImageChange(img) {
    var employee = this.state.employee;
    employee.photo = img;
    this.setState({ employee });
  }
  handleFormSubmit = () => {
    let _this = this;
    const { employee, isRoot } = this.state;
    employee.email = employee.email ? employee.email.toLowerCase() : null;
    employee.title = !employee.title ? "Mr." : employee.title;
    employee.gender = employee.title === "Mr." ? "Male" : "Female";
    const nameValid = !employee.name ? false : true;
    // const supervisorValid = !employee.supervisor ? false : true;
    const stateValid = !employee.state ? false : true;
    const cityValid = !employee.city ? false : true;
    const emailValid = !employee.email ? false : !employee.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/) ? false : true;
    const pan = true;
    // const pan = employee.bankDetails ? !employee.bankDetails.panNo ? true : !employee.bankDetails.panNo.match(/^([a-zA-Z])([0-9])([a-zA-Z])?$/) : true
    const phoneValid = !employee.phone ? false : true;
    // const genderValid = !employee.gender ? false : true;
    // const birthDateValid = !employee.birthDate ? false : true;
    const designationValid = !employee.designation ? false : true;
    const _parentValid = isRoot ? true : !employee._parent ? false : true;
    const formError = !pan ? "Enter pan card" : ""
    // !nameValid || !supervisorValid || !stateValid || !cityValid || !emailValid || !phoneValid || !pan || !designationValid ?
    !nameValid || !stateValid || !emailValid || !phoneValid || !pan || !designationValid || !_parentValid ?
      _this.setState({
        nameValid, stateValid, formError,
        emailValid, phoneValid, designationValid,
        _parentValid,
      }) : this.submitForm(employee);
  }
  submitForm = emp => {
    delete emp.payroll;
    if (emp.code === undefined || emp.code === "new") {
      delete emp.code;
      createEmployee(emp, () => this.success("Employee added successfully!"), this.error)
    } else {
      updateEmployee(emp, () => this.success("Employee saved successfully!"), this.error)
    }
  }
  handleMultipleDocumentChange = (newDocument) => {
    var employee = this.state.employee;
    employee.documents = newDocument.documents;
    this.setState({ employee });
  }
  handleDeleteDocument = (key) => {
    const employee = this.state.employee;
    employee.documents.slice();
    employee.documents.splice(key, 1);
    this.setState({ employee });
  }
  handleInputChange = (elem, value, obj) => {
    const emp = this.state.employee;
    if (!obj) {
      if (elem === "_parent") {
        emp.supervisor = value;
        emp._parent = value;
        this.setState({ employee: emp });
      }
      if (elem === "phone") {
        if (value.match(/^\d{0,10}?$/)) {
          emp[elem] = value;
          this.setState({ employee: emp });
        }
      } else {
        emp[elem] = value;
        this.setState({ employee: emp });
      }
    } else if (obj === "personalDetails") {
      if (elem === "emergencyContact") {
        if (value.match(/^\d{0,10}?$/)) {
          emp.personalDetails = emp.personalDetails ? { ...emp.personalDetails, [elem]: value } : { [elem]: value }
          this.setState({ employee: emp });
        }
      } else {
        emp.personalDetails = emp.personalDetails ? { ...emp.personalDetails, [elem]: value } : { [elem]: value }
        this.setState({ employee: emp });
      }
    } else if (obj === "prevEmployer") {
      emp.prevEmployer = emp.prevEmployer ? { ...emp.prevEmployer, [elem]: value } : { [elem]: value }
      this.setState({ employee: emp });
    } else if (obj === "bankDetails") {
      if (elem === "accountNo") {
        if (value.match(/^\d{0,20}?$/)) {
          emp.bankDetails = emp.bankDetails ? { ...emp.bankDetails, [elem]: value } : { [elem]: value }
          this.setState({ employee: emp });
        }
      } else if (elem === "adharNo") {
        if (value.match(/^\d{0,12}?$/)) {
          emp.bankDetails = emp.bankDetails ? { ...emp.bankDetails, [elem]: value } : { [elem]: value }
          this.setState({ employee: emp });
        }
      } else {
        emp.bankDetails = emp.bankDetails ? { ...emp.bankDetails, [elem]: value } : { [elem]: value }
        this.setState({ employee: emp });
      }
    }
  }
  handleAddressChange = (e) => {
    let newObj = this.state.employee;
    let addr = e.target.name.split("_")[0];
    let field = e.target.name.split("_")[1];
    newObj[addr][field] = e.target.value;
    this.setState({ employee: newObj });
  }
  handleDesignationChange = opt => {
    if (!this.state.isRoot) {
      const employee = this.state.employee;
      opt ? getParentDesignation(opt._parent, this.setMultiDesignation, this.error) : null
      employee.designation = opt ? opt.value : "";
      this.setState({ employee });
    }
  }
  setMultiDesignation = parentDesignation => {
    const obj = { parentDesignation }
    const emp = this.state.employee
    if (emp._parent) {
      const _parent = Array.isArray(parentDesignation) ? parentDesignation.find(el => el.value && el.value.toString() === emp._parent.toString()) : "";
      if (!!_parent) {
        emp._parent = _parent.value;
        obj.employee = emp;
      }
    }
    this.setState(obj)
  }
  render() {
    const Back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const List = (<Tooltip id="delete_tooltip">Employee list</Tooltip>);
    let form = (
      <div>
        <Col xs={12}>
          <Col xs={12} sm={12} md={this.state.employee.code !== "new" ? 3 : 0} lg={this.state.employee.code !== "new" ? 3 : 0} hidden={this.state.employee.code === "new" ? true : false} >
            <UploadComponent className="Profile-images"
              picture
              type="employees"
              photo={this.state.employee.photo}
              details={this.state.employee}
              handleImageChange={this.handleImageChange}

            />
          </Col>
          {this.state.employee.code !== "new" ?
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Employee Code: {this.state.employee.empId}</ControlLabel>
              </FormGroup>
            </Col>
            : null}
          {/* {
            this.state.employee.code !== "new" ?
              <Col xs={12} sm={6} md={7} lg={7}>
                <FormGroup>
                  <ControlLabel>Date And Time: {this.state.employee.createdAt ? Moment(this.state.employee.createdAt).format("DD MMM YYYY hh:mm:ss A") : null}</ControlLabel>
                </FormGroup>
              </Col>
              : null
          } */}
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={6} sm={6} md={2} lg={1}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <Select
                value={this.state.employee.title ? this.state.employee.title : 'Mr.'}
                onChange={opt => this.handleInputChange("title", opt ? opt.value : '')}
                options={[
                  { value: "Mr.", label: "Mr." },
                  { value: "Mrs.", label: "Mrs." },
                  { value: "Miss.", label: "Miss." }
                ]}
              />
            </FormGroup>
          </Col>
          <Col xs={6} sm={6} md={2} lg={2}>
            <FormGroup>
              <ControlLabel>Gender </ControlLabel>
              <Select
                disabled
                clearable={false}
                placeholder="Select gender"
                name="gender"
                value={!this.state.employee.title ? "Male" :
                  this.state.employee.title === "Mr." ? "Male" : "Female"}
                options={
                  [
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]
                }
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>Full Name</ControlLabel>
              <FormControl
                type="text"
                placeholder="Employee name"
                value={this.state.employee.name}
                onChange={e => this.handleInputChange("name", e.target.value)}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col >
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel> State / Region  <span className="star">*</span> </ControlLabel>
              <Select
                clearable={false}
                placeholder="Select state"
                value={this.state.employee.state}
                options={stateList}
                onChange={opt => this.handleInputChange("state", opt ? opt.value : '')}
                style={this.state.stateValid || this.state.stateValid === null ? { color: "", borderColor: "" } : { color: errorColor, borderColor: errorColor }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>City</ControlLabel>
              {/* <ControlLabel>City<span className="star">*</span></ControlLabel> */}
              <FormControl
                type="text"
                maxLength="30"
                placeholder="Enter city"
                value={this.state.employee.city}
                onChange={e => this.handleInputChange("city", e.target.value)}
                className={this.state.cityValid || this.state.cityValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>Primary EMail<span className="star">*</span> </ControlLabel>
              <FormControl
                type="email"
                placeholder="Enter email"
                value={this.state.employee.email}
                onChange={e => this.handleInputChange("email", e.target.value)}
                className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>Primary Phone <span className="star">*</span></ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">+91</span>
                <FormControl
                  type="text"
                  placeholder="Enter phone number"
                  value={this.state.employee.phone ? this.state.employee.phone : ""}
                  onChange={e => this.handleInputChange("phone", e.target.value)}
                  className={this.state.phoneValid || this.state.phoneValid === null ? "" : "error"}
                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>date of birth</ControlLabel>
              <Datetime
                timeFormat={false}
                closeOnSelect={true}
                inputProps={{ placeholder: "Select birth date", style: this.state.birthDateValid || this.state.birthDateValid === null ? { color: "", borderColor: "" } : { color: errorColor, borderColor: errorColor } }}
                value={this.state.employee.birthDate ? Moment(this.state.employee.birthDate).format("DD MMM YYYY") : ""}
                onChange={(date) => this.handleInputChange("birthDate", date)}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>DEPARTMENT </ControlLabel>
              <FormControl
                type="text"
                placeholder="Enter department"
                value={this.state.employee.department}
                onChange={e => this.handleInputChange("department", e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>Joining Date</ControlLabel>
              <Datetime
                timeFormat={false}
                closeOnSelect={true}
                inputProps={{ placeholder: "Enter joining date" }}
                value={this.state.employee.joiningDate ? Moment(this.state.employee.joiningDate).format("DD MMM YYYY") : null}
                onChange={(date) => this.handleInputChange("joiningDate", date)}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <FormGroup>
              <ControlLabel>DESIGNATION <span className="star">*</span></ControlLabel>
              <Select
                clearable="false"
                placeholder="Select designation"
                value={this.state.employee.designation}
                options={this.state.listOfDesignation}
                style={this.state.designationValid || this.state.designationValid === null ? { color: "", borderColor: "" } : { color: errorColor, borderColor: errorColor }}
                onChange={this.handleDesignationChange}
              />
            </FormGroup>
          </Col>
          {/* <Col xs={12} sm={6} md={2} lg={2}>
            <FormGroup>
              <ControlLabel>supervisor<span className="star">*</span></ControlLabel>
              <Select
                clearable={false}
                placeholder="Select supervisor"
                value={this.state.employee.supervisor ? this.state.employee.supervisor : ''}
                options={this.state.supervisorList}
                onChange={opt => this.handleInputChange("supervisor",  opt ? opt.value : '')}
                style={this.state.supervisorValid || this.state.supervisorValid === null ? { color: "", borderColor: "" } : { color: errorColor, borderColor: errorColor }}
              />
            </FormGroup>
          </Col> */}
          {
            this.state.isRoot ? null :
              <Col xs={12} sm={4} md={4} lg={3}>
                <FormGroup>
                  <ControlLabel>reporting to <span className="star">*</span></ControlLabel>
                  <Select
                    clearable="false"
                    placeholder="Select reporting"
                    value={this.state.employee._parent}
                    options={this.state.supervisorList}
                    // options={this.state.parentDesignation}
                    onChange={opt => this.handleInputChange("_parent", opt ? opt.value : '')}
                    style={this.state._parentValid || this.state._parentValid === null ? { color: "", borderColor: "" } : { color: errorColor, borderColor: errorColor }}
                  />
                </FormGroup>
              </Col>
          }
        </Col>
        <Col xs={12}>
          <div>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Tab.Container id="customer-details" defaultActiveKey="personal">
                <Row className="clearfix">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Nav bsStyle="tabs">
                      <NavItem eventKey="personal" className=""> Personal Details</NavItem>
                      <NavItem eventKey="preEmployee" className=""> Previous Employer</NavItem>
                      <NavItem eventKey="bankDetail" className="text-center"><i className="" />Bank Details</NavItem>
                      {/* {!this.state.employee.code ? null : < NavItem eventKey="addresses" className="text-center"><i className="" />Addresses</NavItem>} */}
                      {!this.state.employee.code || this.state.employee.code === "new" ? null : <NavItem eventKey="documents" className=" "> Documents</NavItem>}
                      {!this.state.employee.code || this.state.employee.code === "new" ? null : <NavItem eventKey="payroll" className=" "> Payroll</NavItem>}
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
                                onChange={e => this.handleInputChange("emergencyName", e.target.value, "personalDetails")}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Emergency Contact Number </ControlLabel>
                              <span className="input-group">
                                <span className="input-group-addon">+91</span>
                                <FormControl
                                  type="text"
                                  minLength={9}
                                  maxLength={12}
                                  placeholder="Enter phone number"
                                  value={this.state.employee.personalDetails && this.state.employee.personalDetails.emergencyContact ? this.state.employee.personalDetails.emergencyContact : ""}
                                  onChange={e => this.handleInputChange("emergencyContact", e.target.value, "personalDetails")}
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
                                onChange={opt => this.handleInputChange("bloodGroup", opt ? opt.value : '', "personalDetails")}
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
                                onChange={e => this.handleInputChange("nominy", e.target.value, "personalDetails")}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>pf no </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter PF no"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.pfNo : ""}
                                onChange={e => this.handleInputChange("pfNo", e.target.value, "personalDetails")}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>esci no </ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter ESIC no"
                                value={this.state.employee.personalDetails ? this.state.employee.personalDetails.ESICNo : ""}
                                onChange={e => this.handleInputChange("ESICNo", e.target.value, "personalDetails")}
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
                                onChange={opt => this.handleInputChange("maritalStatus", opt ? opt.value : '', "personalDetails")}
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
                                    onChange={e => this.handleInputChange("spouse", e.target.value, "personalDetails")}
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
                                onChange={e => this.handleInputChange("companyName", e.target.value, "prevEmployer")}
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
                                onChange={e => this.handleInputChange("designation", e.target.value, "prevEmployer")}
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
                                value={this.state.employee.prevEmployer && this.state.employee.prevEmployer.joiningDate ? Moment(this.state.employee.prevEmployer.joiningDate).format("DD MMM YYYY") : ""}
                                onChange={opt => this.handleInputChange("joiningDate", opt ? opt : '', "prevEmployer")}
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
                                value={this.state.employee.prevEmployer && this.state.employee.prevEmployer.releavingDate ? Moment(this.state.employee.prevEmployer.releavingDate).format("DD MMM YYYY") : ""}
                                onChange={opt => this.handleInputChange("releavingDate", opt ? opt : '', "prevEmployer")}
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
                                onChange={e => this.handleInputChange("prevEmpAddress", e.target.value, "prevEmployer")}
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
                                onChange={e => this.handleInputChange("bankName", e.target.value, "bankDetails")}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Bank Accout Number</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter bank accout number"
                                value={this.state.employee.bankDetails && this.state.employee.bankDetails.accountNo ? this.state.employee.bankDetails.accountNo : ""}
                                onChange={e => this.handleInputChange("accountNo", e.target.value, "bankDetails")}
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
                                onChange={e => this.handleInputChange("ifscCode", e.target.value, "bankDetails")}
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
                                onChange={e => this.handleInputChange("panNo", e.target.value, "bankDetails")}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12} sm={4} md={3} lg={3}>
                            <FormGroup>
                              <ControlLabel>Adhar Card Number</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Enter adhar card number"
                                value={this.state.employee.bankDetails && this.state.employee.bankDetails.adharNo ? this.state.employee.bankDetails.adharNo : ""}
                                onChange={e => this.handleInputChange("adharNo", e.target.value, "bankDetails")}
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
        <OverlayTrigger placement="top" overlay={Back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={List} style={{ backgroundColor: "red" }}>
          <Button bsStyle="primary" fill icon onClick={() => { return this.props.history.push("/hrms/employees/list"); }}> <span className="fa fa-list"></span>
          </Button>
        </OverlayTrigger>
        < OverlayTrigger placement="top" overlay={Save}>
          <Button bsStyle="success" fill pullRight icon tooltip="Save" onClick={this.handleFormSubmit}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    );
    return (
      <Row className="card-content">
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