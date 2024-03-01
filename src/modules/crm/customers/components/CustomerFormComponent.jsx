import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "components/CustomSelect/CustomSelect.jsx";
import Moment from "moment";
import { FormGroup, ControlLabel, FormControl, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

import SalesModuleListComponent from "modules/sales/orders/components/SalesModuleListComponent.jsx";
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import DispatchListComponent from "modules/sales/dispatches/components/DispatchListComponent.jsx";
import { updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";
import ContactsListComponent from 'modules/common/contacts/components/ContactsListComponent.jsx';
import AddressesListComponent from 'modules/common/addresses/components/AddressesListComponent.jsx';
import { createCustomer, updateCustomer, deleteCustomer, getCustomerSingle } from "modules/crm/customers/server/CustomerServerComm.jsx";

class CustomerFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      edit: !props.settings,
      customerList: [],
      users: [],
      customer: {
        code: "New",
        number: "New",
        name: "",
        gstin: "",
        pan: "",
        city: "Pune",
        state: "Maharashtra",
        salesRepresentative: null,
        email: "",
        phone: "",
        paymentTerm: "",
        creditLimit: "",
        ledgerBalance: 0,
        gstApplicable: true,
        gstAvailable: true,
        gstDeclaration: false,
        billingType: 'Advance Payment',
        ereport: true,
        paperReport: false,
        contacts: [],
        addresses: [],
        commAddr: {},
        billingAddr: {},
        shippingAddr: {},
        custom: [],
        imagePreviewUrl: "",
        photo: "",
        documents: []
      },
      customerForm: {
        mandatory: [],
        custom: []
      },
      nameError: false,
      gstinError: false,
      panError: false,
      cityError: false,
      stateError: false,
      emailError: false,
      phoneError: false,
      paymentTermError: false,
      creditLimitError: false,
      //Validation
      codeValid: null,
      nameValid: null,
      gstinValid: null,
      panValid: null,
      cityValid: null,
      stateValid: null,
      emailVaild: null,
      phoneValid: null,
      phoneVaild: null,
      paymentTermVaild: null,
      creditLimitVaild: null,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
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
  }
  componentWillMount() {
    var _this = this;
    getUserList("view=user",
      function success(data) {
        _this.setState({
          users: data.rows
        })
      },
    )
    if (_this.props.customer) {
      getCustomerSingle(_this.props.customer.code,
        (res) => {
          _this.setState({ customer: res })
        },
        () => { }
      )
    }
    else {
      if (_this.props.match.params.customercode !== 'new') {
        getCustomerSingle(_this.props.match.params.customercode,
          (res) => {
            _this.setState({ customer: res })
          },
          () => { }
        )
      }
    }
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
          You will not be able to recover this customer!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteCustomer(_this.state.customer.code,
      function success(data) {
        _this.props.history.push("/crm/customers");
      },
      function error(code) {
        _this.errorAlert("Error in deleting customer.");
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
          onConfirm={() => this.setState({ alert: null })}
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
  addCustomField() {
    this.setState({
      alert: (
        <SweetAlert
          input
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Enter Title"
          onConfirm={e => this.inputConfirmAlert(e)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="info"
        />
      )
    });
  }
  inputConfirmAlert(e) {
    this.setState({ alert: null });
    var newObj = this.state.customerForm;
    newObj.custom.push({ name: e.toString().replace(/\s+/g, '').toLowerCase(), label: e, value: true });
    this.setState({ customerForm: newObj });
    updateUserForm(this.state.customerForm,
      function success() { },
      function error() { }
    )
  }
  validationCheck() {
    this.state.customer.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    var panPattern = /^([a-zA-Z])([0-9])([a-zA-Z])?$/;
    panPattern.test(this.state.customer.pan) === false ?
      this.setState({ panError: "Enter Pan Number", panValid: false }) :
      this.setState({ panError: "", panValid: true })
    this.state.customer.city === "" ?
      this.setState({ cityError: "Enter city Name", cityValid: false }) :
      this.setState({ cityError: "", cityValid: true })
    var gstPattern = /^(([a-z\-0-9\-A-Z]{15,15}))$/;
    gstPattern.test(this.state.customer.gstin) === false ?
      this.setState({ gstinError: "Enter Gstin", gstinValid: false }) :
      this.setState({ gstinError: "", gstinValid: true })
    this.state.customer.state === "" ?
      this.setState({ stateError: "Enter state Name", stateValid: false }) :
      this.setState({ stateError: "", stateValid: true })
    this.state.customer.email === "" ?
      this.setState({ emailError: "Enter state Name", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    this.state.customer.creditLimit === "" ?
      this.setState({ creditLimitError: "Enter credit Limit", creditLimitVaild: false }) :
      this.setState({ creditLimitError: "", creditLimitVaild: true })
    this.state.customer.paymentTerm === "" ?
      this.setState({ paymentTermError: "Enter payment term", paymentTermVaild: false }) :
      this.setState({ paymentTermError: "", paymentTermVaild: true })
    this.state.customer.phone === "" ?
      this.setState({ phoneError: "Enter contact no", phoneVaild: false }) :
      this.setState({ phoneError: "", phoneVaild: true })

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(this.state.customer.email) === false ?
      this.setState({ emailError: "EMAIL_IS_REQUIRED", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(this.state.customer.phone) === false ?
      this.setState({ phoneError: ("Mobile number should be 10 digits"), phoneVaild: false }) :
      this.setState({ phoneError: "", phoneVaild: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempCustomer = JSON.parse(JSON.stringify(this.state.customer))
    tempCustomer.email = tempCustomer.email.toLowerCase();
    _this.state.nameValid && _this.state.creditLimitVaild && _this.state.paymentTermVaild ? (
      _this.setState({ formError: "" }),
      this.props.customer !== null ? (
        (_this.props.match.params.customercode !== 'new') ? (
          updateCustomer(tempCustomer,
            function success() {
              _this.successAlert("Customer saved successfully!");
            },
            function error() {
              _this.errorAlert("Error in saving customer.");
            }
          )
        ) :
          (delete tempCustomer.code,
            createCustomer(tempCustomer,
              function success(data) {
                setTimeout(() => {
                  _this.successAlert("Customer added successfully!");
                  _this.props.history.push("/crm/customers-edit/" + data.code)
                  _this.setState({ customer: data })
                }, 2000);
              },
              function error(res) {
                if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate customer name"); }
                else {
                  _this.errorAlert("Something went wrong!")
                }
              }
            )
          )
      ) :
        (delete tempCustomer.code,
          createCustomer(tempCustomer,
            function success(data) {
              setTimeout(() => {
                _this.successAlert("Customer added successfully!");
                _this.props.history.push("/crm/customers-edit/" + data.code)
                _this.setState({ customer: data })
              }, 2000);
            },
            function error(res) {
              if (res.message === 'Request failed with status code 701') {
                _this.errorAlert("Duplicate customer name");
              }
              else {
                _this.errorAlert("Something went wrong!")
              }
            }
          )
        )
    ) : _this.setState({ formError: "Please enter required fields" })
  }

  handleDropDownChange(selectOption, type) {
    var newCustomer = this.state.customer;
    newCustomer[type] = selectOption ? selectOption.value : null;
    this.setState({ customer: newCustomer });
  }
  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }
  handleImageChange(img) {
    var customer = this.state.customer;
    customer.photo = img;
    this.setState({ customer });
  }
  handleMultipleDocumentChange(newDocument) {
    var customer = this.state.customer;
    customer.documents = newDocument.documents;
    this.setState({ customer });
  }
  handleDeleteDocument(key) {
    let customer = this.state.customer;
    customer.documents.slice();
    customer.documents.splice(key, 1);
    this.setState({ customer });
  }

  handleInputChange(e) {
    var newObj = this.state.customer;
    if (e.target.name === "phone") {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ customer: newObj });
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
      this.setState({ customer: newObj });
    } else if (e.target.name.indexOf("radio_") !== -1) {
      newObj[e.target.name.split("_")[1]] = e.target.value;
      this.setState({ customer: newObj });
    } else {
      newObj[e.target.name] = e.target.value;
      this.setState({ customer: newObj });
    }
  }
  handleAddressChange(e) {
    let newObj = this.state.customer;
    let addr = e.target.name.split("_")[0];
    let field = e.target.name.split("_")[1];
    newObj[addr][field] = e.target.value;
    this.setState({ customer: newObj });
  }
  handleSettingsChange(e) {
    var newObj = this.state.customerForm;
    newObj.custom[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
    this.setState({ customerForm: newObj });
    updateUserForm(this.state.customerForm,
      function success() { },
      function error() { }
    )
  }
  handleCheckedChange(e) {
    var newObj = this.state.customer;
    newObj[e.target.name] = e.target.checked;
    this.setState({ newObj });
  }
  render() {
    const Back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const List = (<Tooltip id="delete_tooltip">Customer list</Tooltip>);
    let form = (
      // <Row>
      <div>
        {/* <Col xs={12} sm={12} md={this.state.customer.code ? 2 : 0} lg={2} hidden={this.props.match.params.customercode === "new" ? true : false}>
          <UploadComponent
            picture
            type="customers"
            photo={this.state.customer.photo}
            details={this.state.customer}
            handleImageChange={this.handleImageChange}
          />
        </Col>       */}
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Code: {this.state.customer.number}</ControlLabel>
            </FormGroup>
          </Col>
          {this.props.customer !== null ?
            (this.props.match.params.customercode !== "new") ?
              (
                <Col xs={12} sm={4} md={3} lg={3}>
                  <FormGroup>
                    <ControlLabel>Created by: {this.state.customer.user ? this.state.customer.user.name : ""}</ControlLabel>
                  </FormGroup>
                </Col>
              ) : null
            : null
          }
          {this.props.customer !== null ?
            (this.props.match.params.customercode !== "new") ?
              (
                <Col xs={12} sm={6} md={4} lg={3}>
                  <FormGroup>
                    <ControlLabel>Date And Time: {this.state.customer.createdAt ? Moment(this.state.customer.createdAt).format("DD MMM YYYY hh:mm:ss A") : null}</ControlLabel>
                  </FormGroup>
                </Col>
              ) : null
            : null
          }
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Name <span className="star">*</span> </ControlLabel>
              <FormControl
                name="name"
                type="text"
                placeholder="Customer name"
                value={this.state.customer.name}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Sales Representative</ControlLabel>
              <Select
                clearable={false}
                placeholder="Select sales representative"
                name="salesRepresentative"
                value={this.state.customer.salesRepresentative ? this.state.customer.salesRepresentative : null}
                options={this.state.users}
                onChange={(selectOption) => this.handleDropDownChange(selectOption, "salesRepresentative")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>PAN Number </ControlLabel>
              <FormControl
                name="pan"
                type="text"
                minLength="10"
                maxLength="10"
                placeholder="PAN number"
                value={this.state.customer.pan.toUpperCase()}
                onChange={this.handleInputChange}
              //className={this.state.panValid || this.state.panValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>City</ControlLabel>
              <FormControl
                disabled
                name="city"
                type="text"
                maxLength="30"
                placeholder="Enter city"
                value={this.state.customer.city}
                onChange={this.handleInputChange}
                className={this.state.cityValid || this.state.cityValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>State / Region </ControlLabel>
              <FormControl
                disabled
                name="state"
                type="text"
                placeholder="Select state/region"
                value={this.state.customer.state}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Primary EMail </ControlLabel>
              <FormControl
                name="email"
                type="email"
                placeholder="Enter email"
                value={this.state.customer.email.toLowerCase()}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Primary Phone </ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">+91</span>
                <FormControl
                  name="phone"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  placeholder="Enter phone"
                  value={this.state.customer.phone}
                  onChange={this.handleInputChange}
                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Payment Terms <span className="star">*</span> </ControlLabel>
              <div>
                <span className="input-group">
                  <FormControl
                    name="paymentTerm"
                    type="number"
                    step="1"
                    minLength="1"
                    min="0"
                    max={30}
                    maxLength="99"
                    pattern="^\d+(?:\.\d{1,2})?$"
                    placeholder="0"
                    value={this.state.customer.paymentTerm ? this.state.customer.paymentTerm : ""}
                    onChange={this.handleInputChange}
                    className={this.state.paymentTermVaild || this.state.paymentTermVaild === null ? "" : "error"}
                  />
                  <span className="input-group-addon">Days</span>
                </span>
              </div>
            </FormGroup>
          </Col>
        </Col>
        <Col xs={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Credit Limit <span className="star">*</span> </ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">₹</span>
                <FormControl
                  name="creditLimit"
                  type="text"
                  placeholder="0"
                  value={this.state.customer.creditLimit}
                  onChange={this.handleInputChange}
                  className={this.state.creditLimitVaild || this.state.creditLimitVaild === null ? "" : "error"}
                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Ledger Balance</ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">₹</span>
                <FormControl
                  name="ledgerBalance"
                  type="text"
                  placeholder="Enter credit limit"
                  value={this.state.customer.ledgerBalance}
                  onChange={this.handleInputChange}
                />
              </span>
            </FormGroup>
          </Col>
        </Col>
        <Col xs={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <Checkbox
                inline
                number="gstApplicable"
                name="gstApplicable"
                label="GST Applicable"
                onChange={this.handleCheckedChange}
                checked={this.state.customer.gstApplicable}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <Checkbox
                inline
                number="gstAvailable"
                name="gstAvailable"
                label="GST Available"
                onChange={this.handleCheckedChange}
                checked={this.state.customer.gstAvailable}
              />
            </FormGroup>
          </Col>
          {
            (this.state.customer.gstApplicable && this.state.customer.gstAvailable)
              ? (
                <Col xs={12} sm={6} md={3} lg={3}>
                  <FormGroup>
                    <ControlLabel>GST Number </ControlLabel>
                    <FormControl
                      name="gstin"
                      type="text"
                      minLength="15"
                      maxLength="15"
                      placeholder="GST number"
                      value={this.state.customer.gstin.toUpperCase()}
                      onChange={this.handleInputChange}
                    // className={this.state.gstinValid || this.state.gstinValid === null ? "" : "error"}
                    />
                  </FormGroup>
                </Col>
              ) : (
                <Col xs={12} sm={6} md={3} lg={3}>
                  <FormGroup>
                    <Checkbox
                      inline
                      number="gstDeclaration"
                      name="gstDeclaration"
                      label="GST Declaration"
                      onChange={this.handleCheckedChange}
                      checked={this.state.customer.gstDeclaration}
                    />
                  </FormGroup>
                </Col>
              )
          }
        </Col>
        {this.props.customer !== null ?
          <Col xs={12}>
            {
              this.state.customer.code !== "New" ? (
                this.props.className === "fa fa-plus" || this.props.className === undefined ?
                  <div >
                    <h6 className="section-header">Customer Details</h6>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Tab.Container id="customer-details" defaultActiveKey="contacts">
                        <Row className="clearfix">
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Nav bsStyle="tabs">
                              <NavItem eventKey="contacts" className=""> Contacts</NavItem>
                              <NavItem eventKey="addresses" className=""> Addresses</NavItem>
                              <NavItem eventKey="orders" className=""> Orders</NavItem>
                              <NavItem eventKey="dispatches" className=""> Dispatches</NavItem>
                              <NavItem eventKey="documents" className=" "> Documents</NavItem>
                            </Nav>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Tab.Content animation>
                              <Tab.Pane eventKey="contacts">
                                <ContactsListComponent customer id={this.state.customer.id} {...this.props}></ContactsListComponent>
                              </Tab.Pane>
                              <Tab.Pane eventKey="addresses">
                                <AddressesListComponent customer id={this.state.customer.id} {...this.props}></AddressesListComponent>
                              </Tab.Pane>
                              <Tab.Pane eventKey="orders">
                                <Row>
                                  <SalesModuleListComponent moduleName="salesOrder" view="customer" customercode={this.state.customer ? this.state.customer.id : null} {...this.props}></SalesModuleListComponent>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="dispatches">
                                <Row>
                                  <DispatchListComponent moduleName="dispatch" view="customer" customercode={this.state.customer ? this.state.customer.id : null} {...this.props}></DispatchListComponent>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="documents">
                                <Row>
                                  <UploadComponent
                                    document
                                    type="customers"
                                    documents={this.state.customer.documents}
                                    details={this.state.customer}
                                    dropText="Drop files or click here"
                                    handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                                    handleDeleteDocument={this.handleDeleteDocument}
                                  />
                                </Row>
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Col>
                  </div>
                  : null
              ) : ""
            }
          </Col>
          : null
        }
      </div>

    )
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        {this.props.customer !== null ?
          this.props.className === "fa fa-plus" || this.props.className === undefined ?
            <OverlayTrigger placement="top" overlay={Back}>
              <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
            </OverlayTrigger>
            : null
          : null
        }
        {this.props.customer !== null ?
          this.props.className === "fa fa-plus" || this.props.className === undefined ?
            <OverlayTrigger placement="top" overlay={List} style={{ backgroundColor: "red" }}>
              <Button bsStyle="primary" fill icon
                disabled={this.state.settings}
                onClick={() => { return this.props.history.push("/crm/customers"); }}>
                <span className="fa fa-list"></span>
              </Button>
            </OverlayTrigger>
            : null
          : null
        }
        {this.props.className === "fa fa-plus" || this.props.className === undefined ?
          < OverlayTrigger placement="top" overlay={Save}>
            <Button bsStyle="success" fill pullRight icon tooltip="Save" onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
          : null
        }
      </Col>
    );
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form ">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    )
  }
}

export default CustomerFormComponent;