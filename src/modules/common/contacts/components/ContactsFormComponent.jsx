import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { FormGroup, ControlLabel, FormControl, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js";

import { createContact, updateContact, getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";


class AddressesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: getSocket(),
      contact: {
        code: "New",
        name: "",
        email: "",
        phone: "",
        customer: null,
        location: null,
        vendor: null,
      },
      contactList: [],
      editObj: null,
      alert: null,
      nameError: false,
      emailError: false,
      phoneError: false,
      nameValid: null,
      emailValid: null,
      phoneValid: null,

    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.save = this.save.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
  }
  componentWillMount() {
    this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    var _this = this;
    let params = "";
    if (this.props.showConatct) {
      if (this.props.id) params = "&location=" + (this.props.id.id ? this.props.id.id : this.props.id);
      if (this.props.customer) params = params + "&customer=" + (this.props.customer ? this.props.customer.id : null);
      if (this.props.vendor) params = params + "&vendor=" + (this.props.vendor.id);
      getContactList(params,
        function success(data) {
          _this.setState({ contactList: data.rows.filter(s => { return (s.id === _this.props.contactDetails.id) }) })
          _this.setState({ contact: _this.state.contactList[0] });

        },
        function error() { _this.setState({ contact: [] }); }
      );
    }
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


  validationCheck() {
    this.state.contact.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    this.state.contact.email === "" ?
      this.setState({ emailError: "Enter email Id", emailValid: false }) :
      this.setState({ emailError: "", emailValid: true })
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(this.state.contact.email) === false ?
      this.setState({ emailError: "EMAIL_IS_REQUIRED", emailVaild: false }) :
      this.setState({ emailError: "", emailVaild: true })
    this.state.contact.phone === "" ?
      this.setState({ phoneError: "Enter postal code", phoneValid: false }) :
      this.setState({ phoneError: "", phoneValid: true })
    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(this.state.contact.phone) === false ?
      this.setState({ phoneError: ("Mobile number should of 10 digits"), phoneVaild: false }) :
      this.setState({ phoneError: "", phoneVaild: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempContact = JSON.parse(JSON.stringify(this.state.contact))
    if (tempContact.code === "New") {
      tempContact.location = this.props.locationId ? this.props.locationId.id : null;
      tempContact.customer = this.props.customer ? this.props.customer.id : null;
      tempContact.vendor = this.props.vendor ? this.props.vendor.id : null;

    }
    else {
      tempContact.location = tempContact.location ? tempContact.location.id : null;
      tempContact.customer = tempContact.customer ? tempContact.customer.id : null;
      tempContact.vendor = tempContact.vendor ? tempContact.vendor.id : null;


    }
    if (_this.state.nameValid && _this.state.phoneValid) {
      delete tempContact.employee;
      if (tempContact.customer !== null) delete tempContact.vendor;
      _this.setState({ formError: "" })
      if (tempContact.code === "New") {
        delete tempContact.code;
        createContact(tempContact,
          function success() {
            _this.successAlert("Contact added successfully!");
            setTimeout(() => {
              _this.props.handleCloseContactModal()
            }, 2000);
          },
          function error() {
            _this.errorAlert("Error in creating contact.");
          }
        )
      } else {
        updateContact(tempContact,
          function success() {
            _this.successAlert("Contact saved successfully!");
            setTimeout(() => {
              _this.props.handleCloseContactModal()
            }, 2000);
          },
          function error() {
            _this.errorAlert("Error in updating contact.");
          }
        )
      }
    }
    else { this.setState({ formError: "Please enter required fields" }) }

  }


  handleInputChange(e) {
    let _this = this;
    var newObj = this.state.contact || {};
    if (e.target.name === "phone") {
      const re = /^[0-9\b]+$/;
      let tempObj = this.state.contact;
      if (e.target.value === '' || re.test(e.target.value)) {
        tempObj.phone = e.target.value;
        this.setState({ tempObj })
      }
      else {
        return null;
      }
    }
    if (e.target.name === "email") {
      newObj[e.target.name] = e.target.value.toLowerCase();
      _this.setState({ contact: newObj });
    }
    else {
      newObj[e.target.name] = e.target.value;
      _this.setState({ contact: newObj });
    }
  }

  render() {
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    let form = (
      <div>
        {this.props.vendor === undefined && this.state.contactList.length
          ?
          (<div>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel><b>Customer:</b>{this.state.contact.customer ? this.state.contact.customer.name : ""}  </ControlLabel>
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel><b>Location:</b>{this.state.contact.location ? this.state.contact.location.name : ""}  </ControlLabel>
              </FormGroup>
            </Col>
          </div>
          ) :
          (this.props.vendor !== undefined && this.state.contactList.length
            ?
            (
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel><b>vendor:</b>{this.state.contact.vendor ? this.state.contact.vendor.name : null}  </ControlLabel>
                </FormGroup>
              </Col>
            )
            :
            (
              null
            )

          )
        }
        <Col xs={12}>
          <FormGroup>
            <ControlLabel> Name <span className="star">*</span> </ControlLabel>
            <FormControl
              name="name"
              type="text"
              placeholder="Enter name"
              value={this.state.contact ? this.state.contact.name : null}
              onChange={this.handleInputChange}
              className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel> Email  </ControlLabel>
            <FormControl
              name="email"
              type="email"
              placeholder="Enter email"
              value={this.state.contact ? this.state.contact.email : null}
              onChange={this.handleInputChange}
            //  className={this.state.emailValid || this.state.emailValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel> phone Number <span className="star">*</span> </ControlLabel>
            <span className="input-group">
              <span className="input-group-addon">+91</span>
              <FormControl
                name="phone"
                type="text"
                minLength={10}
                maxLength={10}
                placeholder=" Enter phone number"
                value={this.state.contact ? this.state.contact.phone : null}
                onChange={this.handleInputChange}
                className={this.state.phoneValid || this.state.phoneValid === null ? "" : "error"}
              />
            </span>
          </FormGroup>
        </Col>
      </div>

    )
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        	<center><h6 className="text-danger">{this.state.formError}</h6></center>
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
      </Row>
    )
  }
}

export default AddressesFormComponent;