import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { FormGroup, ControlLabel, FormControl, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js";

import { createAddress, updateAddress, getAddressList } from "modules/common/addresses/server/AddressesServerComm.jsx";

class AddressesFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: getSocket(),
      address: {
        code: "New",
        name: "",
        street_address: "",
        zipcode: "",
        Latitude: "",
        Longitude: "",
        customer: null,
        location: null,
        vendor: null,
      },
      addressList: [],
      editObj: null,
      alert: null,
      nameError: false,
      street_addressError: false,
      zipcodeError: false,
      nameValid: null,
      street_addressValid: null,
      zipcodeValid: null,

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
    if (this.props.showAddress) {
      if (this.props.id) params = "&location=" + (this.props.id.id ? this.props.id.id : this.props.id);
    //  if (this.props.customer) params = params + "&customer=" + (this.props.customer ? this.props.customer.id : null);
      if (this.props.vendor) params = params + "&vendor=" + (this.props.vendor.id);
      getAddressList(params,
        function success(data) {
          _this.setState({ addressList: data.rows.filter(s => { return (s.id === _this.props.addressDetails.id) }) })
          _this.setState({ address: _this.state.addressList[0] });

        },
        function error() { _this.setState({ address: [] }); }
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
    this.state.address.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    this.state.address.street_address === "" ?
      this.setState({ street_addressError: "Enter address", street_addressValid: false }) :
      this.setState({ street_addressError: "", street_addressValid: true })
    this.state.address.zipcode === "" ?
      this.setState({ zipcodeError: "Enter postal code", zipcodeValid: false }) :
      this.setState({ zipcodeError: "", zipcodeValid: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempAddress = JSON.parse(JSON.stringify(this.state.address))
    if (tempAddress.code === "New") {
      tempAddress.location = this.props.locationId ? this.props.locationId.id : null;
      tempAddress.customer = this.props.customer ? this.props.customer.id : null;
      tempAddress.vendor = this.props.vendor ? this.props.vendor.id : null;
    }
    else {
      tempAddress.location = tempAddress.location ? tempAddress.location.id : null;
      tempAddress.customer = tempAddress.customer ? tempAddress.customer.id : null;
      tempAddress.vendor = tempAddress.vendor ? tempAddress.vendor.id : null;
    }
    if (_this.state.nameValid && _this.state.street_addressValid && _this.state.zipcodeValid) {
      _this.setState({ formError: "" })
      if (tempAddress.code === "New") {
        delete tempAddress.code;
        createAddress(tempAddress,
          function success() {
            _this.successAlert("Address added successfully!");
            setTimeout(() => {
              _this.props.handleCloseAddressModal()
            }, 2000);
          },
          function error() {
            _this.errorAlert("Error in creating address.");
          }
        )
      } else {
        updateAddress(tempAddress,
          function success() {
            _this.successAlert("Address saved successfully!");
            setTimeout(() => {
              _this.props.handleCloseAddressModal()
            }, 2000);
          },
          function error() {
            _this.errorAlert("Error in updating address.");
          }
        )
      }
    }
    else { this.setState({ formError: "Please enter required fields" }) }

  }


  handleInputChange(e) {
    let _this = this;
    var newObj = this.state.address;
    if (e.target.name === "zipcode") {
      const re = /^[0-9\b]+$/;
      let tempObj = this.state.address;
      if (e.target.value === '' || re.test(e.target.value)) {
        tempObj.zipcode = e.target.value;
        this.setState({ tempObj })
      }
      else {
        return null;
      }
    }
    else {
      newObj[e.target.name] = e.target.value;
      _this.setState({ address: newObj });
    }
  }

  render() {
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    let form = (
      <div>
        {this.props.vendor === undefined && this.state.addressList.length
          ?
          (<div>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel><b>Customer:</b>{this.state.address.customer ? this.state.address.customer.name : ""}  </ControlLabel>
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel><b>Location:</b>{this.state.address.location ? this.state.address.location.name : ""}  </ControlLabel>
              </FormGroup>
            </Col>
          </div>
          ) :
          (this.props.vendor !== undefined && this.state.addressList.length
            ?
            (<Col xs={12}>
              <FormGroup>
                <ControlLabel><b>Vendor:</b>{this.state.address.vendor ? this.state.address.vendor.name : ""}  </ControlLabel>
              </FormGroup>
            </Col>
            )
            : (
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
              value={this.state.address ? this.state.address.name : null}
              onChange={this.handleInputChange}
              className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel> Address <span className="star">*</span> </ControlLabel>
            <FormControl
              componentClass="textarea"
              name="street_address"
              type="text"
              placeholder="Enter address"
              rows={3}
              value={this.state.address ? this.state.address.street_address : null}
              onChange={this.handleInputChange}
              className={this.state.street_addressValid || this.state.street_addressValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel> Postal code <span className="star">*</span> </ControlLabel>
            <FormControl
              name="zipcode"
              type="text"
              minLength={6}
              maxLength={6}
              placeholder="Postal code"
              value={this.state.address ? this.state.address.zipcode : null}
              onChange={this.handleInputChange}
              className={this.state.zipcodeValid || this.state.zipcodeValid === null ? "" : "error"}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormGroup>
            <ControlLabel> latitude  </ControlLabel>
            <FormControl
              name="latitude"
              type="number"
              placeholder="Enter latitude"
              value={this.state.address ? this.state.address.latitude : null}
              onChange={this.handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <FormGroup>
            <ControlLabel> longitude  </ControlLabel>
            <FormControl
              name="longitude"
              type="number"
              placeholder="Enter longitude"
              value={this.state.address ? this.state.address.longitude : null}
              onChange={this.handleInputChange}
            />
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