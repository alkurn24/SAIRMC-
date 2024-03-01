import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "moment";
import Select from "components/CustomSelect/CustomSelect.jsx";
import { FormGroup, ControlLabel, FormControl, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";

import { stateList } from 'variables/appVariables.jsx';
import { errorColor } from 'variables/Variables.jsx';

import ContactsListComponent from 'modules/common/contacts/components/ContactsListComponent.jsx';
import AddressesListComponent from 'modules/common/addresses/components/AddressesListComponent.jsx';
import PurchaseModuleListComponent from 'modules/purchase/orders/components/PurchaseModuleListComponent.jsx';
import GrnListComponent from 'modules/purchase/grn/components/GrnListComponent.jsx';
import { updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";

import { createVendor, updateVendor, deleteVendor, getVendorSingle } from "../server/VendorServerComm.jsx";


class VendorFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      edit: !props.settings,
      VendorList: [],
      vendor: {
        code: "New",
        name: "",
        gstin: "",
        pan: "",
        city: "Pune",
        state: "",
        email: "",
        phone: "",
        paymentTerm: "",
        contacts: [],
        addresses: [],
        commAddr: {},
        billingAddr: {},
        shippingAddr: {},
        vendor: [],
        imagePreviewUrl: "",
        photo: "",
        documents: []
      },
      vendorForm: {
        mandatory: [],
        vendor: []
      },

      codeError: false,
      nameError: false,
      gstinError: false,
      panError: false,
      cityError: false,
      stateError: false,
      paymentTermError: false,
      emailError: false,
      phoneError: false,
      codeValid: null,
      nameValid: null,
      gstinValid: null,
      panValid: null,
      cityValid: null,
      stateValid: null,
      emailVaild: null,
      phoneValid: null,
      phoneVaild: null,
      paymentTermValid: null,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
  }

  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }
  componentWillMount() {
    var _this = this;

    if (_this.props.vendor !== null) {
      if (_this.props.match.params.vendorcode !== 'new' || (_this.props.vendor)) {
        getVendorSingle(_this.props.match.params.vendorcode || _this.props.vendor.code,
          (res) => {
            _this.setState({ vendor: res })
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
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this vendor!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteVendor(_this.state.vendor.code,
      function success(data) {
        _this.props.history.push("/purchase/vendor");
      },
      function error(code) {
        _this.errorAlert("Error in deleting vendor.");
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
          cancelBtnBsStyle="danger"
        />
      )
    });
  }
  inputConfirmAlert(e) {
    this.setState({ alert: null });
    var newObj = this.state.vendorForm;
    newObj.vendor.push({ name: e.toString().replace(/\s+/g, '').toLowerCase(), label: e, value: true });
    this.setState({ vendorForm: newObj });
    updateUserForm(this.state.vendorForm,
      function success() { },
      function error() { }
    )
  }
  validationCheck() {
    this.state.vendor.name === "" ?
      this.setState({ nameError: "ENTER NAME", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })

    this.state.vendor.city === "" ?
      this.setState({ cityError: "Enter city Name", cityValid: false }) :
      this.setState({ cityError: "", cityValid: true })
    this.state.vendor.gstin === "" ?
      this.setState({ gstinError: "Enter Gstin", gstinValid: false }) :
      this.setState({ gstinError: "", gstinValid: true })
    this.state.vendor.state === "" ?
      this.setState({ stateError: "Enter state Name", stateValid: false }) :
      this.setState({ stateError: "", stateValid: true })
    this.state.vendor.paymentTerm === "" ?
      this.setState({ paymentTermError: "Enter payment term", paymentTermValid: false }) :
      this.setState({ paymentTermError: "", paymentTermValid: true })
    this.state.vendor.email === "" ?
      this.setState({ emailError: "Enter state Name", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    this.state.vendor.phone === "" ?
      this.setState({ phoneError: "Enter contact no", phoneVaild: false }) :
      this.setState({ phoneError: "", phoneVaild: true })
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(this.state.vendor.email) === false ?
      this.setState({ emailError: "EMAIL_IS_REQUIRED", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(this.state.vendor.phone) === false ?
      this.setState({ phoneError: ("Mobile number should of 10 digits"), phoneVaild: false }) :
      this.setState({ phoneError: "", phoneVaild: true })
    setTimeout(this.save, 10);
  }
  create() {
    let _this = this;
    createVendor(this.state.vendor,
      function success(data) {
        setTimeout(() => {
          _this.successAlert("Vendor added successfully!");
          _this.setState({ vendor: data })
        }, 2000);
      },
      function error(res) {
        if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate Vendor name"); }
        else {
          _this.errorAlert("Something went wrong!")
        }
      }
    )
  }
  save() {
    var _this = this;
    _this.state.nameValid && _this.state.stateValid && _this.state.paymentTermValid ? (
      _this.props.vendor !== null ? (
        (_this.props.match.params.vendorcode !== 'new') ? (
          updateVendor(this.state.vendor,
            function success() {
              _this.successAlert("Vendor saved successfully!");
            },
            function error() {
              _this.errorAlert("Error in saving vendor.");
            }
          )
        ) :
          (
            this.create()
          )
      ) : (
          createVendor(this.state.vendor,
            function success(data) {
              setTimeout(() => {
                _this.successAlert("Vendor added successfully!");
                _this.props.history.push("/purchase/vendor-edit/" + data.code)
                _this.setState({ vendor: data })
              }, 2000);
            },
            function error(res) {
              if (res.message === 'Request failed with status code 701') { _this.errorAlert("Duplicate Vendor name"); }
              else {
                _this.errorAlert("Something went wrong!")
              }
            }
          )
        )

    ) : _this.setState({ formError: "Please enter required fields" })
  }

  handleImageChange(img) {
    var vendor = this.state.vendor;
    vendor.photo = img;
    this.setState({ vendor });
  }
  handleMultipleDocumentChange(newDocument) {
    var vendor = this.state.vendor;
    vendor.documents = newDocument.documents;
    this.setState({ vendor });
  }
  handleDeleteDocument(key) {
    let vendor = this.state.vendor;
    vendor.documents.slice();
    vendor.documents.splice(key, 1);
    this.setState({ vendor });
  }
  handleDropDownChange(type, selectOption) {
    var newVendor = this.state.vendor;
    newVendor[type] = selectOption ? selectOption.value : null;

    this.setState({ vendor: newVendor });
  }
  handleInputChange(e) {
    var newObj = this.state.vendor;
    if (e.target.name === "phone") {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ vendor: newObj });
      }
      else {
        return null;
      }
    }
    if (e.target.name.indexOf("custom_") !== -1) {
      var key = parseInt(e.target.name.split("_")[1], 10);
      newObj.vendor[key] = e.target.value;
      this.setState({ vendor: newObj });
    } else if (e.target.name.indexOf("radio_") !== -1) {
      newObj[e.target.name.split("_")[1]] = e.target.value;
      this.setState({ vendor: newObj });
    } else {
      newObj[e.target.name] = e.target.value
      this.setState({ vendor: newObj });
    }

  }
  handleAddressChange(e) {
    let newObj = this.state.vendor;
    let addr = e.target.name.split("_")[0];
    let field = e.target.name.split("_")[1];
    newObj[addr][field] = e.target.value;
    this.setState({ vendor: newObj });
  }
  handleSettingsChange(e) {
    var newObj = this.state.vendorForm;
    newObj.vendor[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
    this.setState({ vendorForm: newObj });
    updateUserForm(this.state.vendorForm,
      function success() { },
      function error() { }
    )
  }

  render() {
    const Back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const List = (<Tooltip id="delete_tooltip">Vendor list</Tooltip>);
    let form = (
      <Row>
        {/* {this.state.vendor.code !== "New" ?
          <Col xs={12} sm={3} md={2} lg={2}>
            <UploadComponent
              picture
              type="vendors"
              photo={this.state.vendor.photo}
              details={this.state.vendor}
              handleImageChange={this.handleImageChange}
            />

          </Col>
          : null
        } */}

        <Col xs={12} sm={12} md={12} lg={12}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col xs={12} sm={4} md={4} lg={3}>
              <FormGroup>
                {this.props.vendor !== null ?
                  this.state.vendor.code !== "New" ?
                    <ControlLabel>Code: {this.state.vendor.number}</ControlLabel>
                    : null
                  : null
                }
              </FormGroup>
            </Col>
            {this.props.vendor !== null ?
              this.state.vendor.code !== "New" ?
                <Col xs={12} sm={4} md={3} lg={3}>
                  <FormGroup>
                    <ControlLabel>Created by: {this.state.vendor.user ? this.state.vendor.user.name : ""}</ControlLabel>
                  </FormGroup>
                </Col>
                : null
              : null
            }
            {this.props.vendor !== null ?
              this.state.vendor.code !== "New" ?
                <Col xs={12} sm={6} md={5} lg={6}>
                  <FormGroup>
                    <ControlLabel>Date And Time: {this.state.vendor.createdAt ? Moment(this.state.vendor.createdAt).format("DD MMM YYYY hh:mm:ss A") : null}</ControlLabel>
                  </FormGroup>
                </Col>
                : null
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
                  placeholder="Vendor name"
                  value={this.state.vendor.name}
                  onChange={this.handleInputChange}
                  className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>GST Number </ControlLabel>
                <FormControl
                  name="gstin"
                  type="text"
                  minLength="15"
                  maxLength="15"
                  placeholder="GST number"
                  value={this.state.vendor.gstin.toUpperCase()}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>PAN Number  </ControlLabel>
                <FormControl
                  name="pan"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  placeholder="PAN number"
                  value={this.state.vendor.pan.toUpperCase()}
                  onChange={this.handleInputChange}
                //className={this.state.panValid || this.state.panValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>City </ControlLabel>
                <FormControl
                  name="city"
                  type="text"
                  maxLength="30"
                  placeholder="Enter city"
                  value={this.state.vendor.city}
                  onChange={this.handleInputChange}
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
                  value={this.state.vendor.state}
                  options={stateList}
                  onChange={(selectedOption) => this.handleDropDownChange("state", selectedOption)}
                  style={{ color: this.state.stateValid || this.state.stateValid === null ? "" : errorColor, borderColor: this.state.stateValid || this.state.stateValid === null ? "" : errorColor }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Primary email </ControlLabel>
                <FormControl
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  value={this.state.vendor.email.toLowerCase()}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Primary Phone  </ControlLabel>
                <span className="input-group">
                  <span className="input-group-addon">+91</span>
                  <FormControl
                    name="phone"
                    type="text"
                    minLength="10"
                    maxLength="10"
                    placeholder="Enter phone"
                    pattern="[0-9]"
                    value={this.state.vendor.phone}
                    onChange={this.handleInputChange}
                  />
                </span>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>payment Terms <span className="star">*</span> </ControlLabel>
                <div>
                  <span className="input-group">
                    <FormControl
                      name="paymentTerm"
                      type="number"
                      step="1"
                      minLength="1"
                      min="1"
                      maxLength="99"
                      pattern="^\d+(?:\.\d{1,2})?$"
                      placeholder="0"
                      value={this.state.vendor.paymentTerm ? this.state.vendor.paymentTerm : ""}
                      onChange={this.handleInputChange}
                      className={this.state.paymentTermValid || this.state.paymentTermValid === null ? "" : "error"}
                    />
                    <span className="input-group-addon">Days</span>
                  </span>
                </div>
              </FormGroup>
            </Col>
          </Col>
        </Col>
        {this.props.vendor !== null ?
          <Col xs={12}>
            {
              this.state.vendor.code !== 'New' ? (
                this.props.className === "fa fa-plus" || this.props.className === undefined ?
                  <div>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <h6 className="section-header" >vendor Details</h6>
                      <Tab.Container id="vendor-details" defaultActiveKey="contacts">
                        <Row className="clearfix">
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Nav bsStyle="tabs">
                              <NavItem eventKey="contacts"> Contacts</NavItem>
                              <NavItem eventKey="address">Addresses</NavItem>
                              <NavItem eventKey="purchaseOrder"> Purchase Orders</NavItem>
                              <NavItem eventKey="grn"> GRN</NavItem>
                              <NavItem eventKey="documents" > Documents</NavItem>
                            </Nav>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Tab.Content animation>
                              <Tab.Pane eventKey="contacts">
                                <ContactsListComponent vendor id={this.state.vendor.id} {...this.props}></ContactsListComponent>
                              </Tab.Pane>
                              <Tab.Pane eventKey="address">
                                <AddressesListComponent vendor id={this.state.vendor.id} {...this.props}></AddressesListComponent>
                              </Tab.Pane>
                              <Tab.Pane eventKey="purchaseOrder">
                                <Row>
                                  <PurchaseModuleListComponent moduleName="purchaseOrder" view="vendor" vendorcode={this.state.vendor.id} {...this.props}></PurchaseModuleListComponent>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="grn">
                                <Row>
                                  <GrnListComponent moduleName="grn" view="vendor" vendorcode={this.state.vendor.id} {...this.props}></GrnListComponent>
                                </Row>
                              </Tab.Pane>
                              <Tab.Pane eventKey="documents">
                                <Row>
                                  <UploadComponent
                                    document
                                    type="vendors"
                                    documents={this.state.vendor.documents}
                                    details={this.state.vendor}
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
      </Row>
    );
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            {this.props.vendor !== null ?
              this.props.className === "fa fa-plus" || this.props.className === undefined ?
                <OverlayTrigger placement="top" overlay={Back}>
                  <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
                </OverlayTrigger>
                : null
              : null
            }
            {this.props.vendor !== null ?
              this.props.className === "fa fa-plus" || this.props.className === undefined ?
                <OverlayTrigger placement="top" overlay={List} style={{ backgroundColor: "red" }}>
                  <Button bsStyle="primary" fill icon
                    disabled={this.state.settings}
                    onClick={() => { return this.props.history.push("/purchase/vendor/vendor"); }}>
                    <span className="fa fa-list"></span>
                  </Button>
                </OverlayTrigger>
                : null
              : null
            }
            {this.props.className === "fa fa-plus" || this.props.className === undefined ?
              <OverlayTrigger placement="top" overlay={Save}>
                <Button bsStyle="success" fill pullRight icon tooltip="Save" onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
              </OverlayTrigger>
              : null
            }
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
          </Col>

          <Col xs={12} sm={4} md={3} lg={3}>
          </Col>
        </Row>
      </Col>
    )

    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form">{form}</div>
        <div className="card-footer actionMar">{actions}</div>
      </Row>
    );
  }
}
export default VendorFormComponent;