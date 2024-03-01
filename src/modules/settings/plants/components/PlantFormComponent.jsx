import React, { Component } from "react";
import { Grid, Row, Col, OverlayTrigger, Tooltip, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import Button from "components/CustomButton/CustomButton.jsx";
import { errorColor } from 'variables/Variables.jsx';
import { createPlant, updatePlant, deletePlant } from "../server/PlantServerComm.jsx";

class PlantFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      plantDetails: props.plantDetails ? props.plantDetails : {
        name: "",
        code: "New",
        suffix: "",
        address: "",
        contactNo: "",
        email: "",
        telephone: "",
        latitude: "",
        longitude: ""
      },
      alert: null,
      nameError: false,
      addressError: false,
      emailError: false,
      suffixError: false,
      contactNoError: false,
      nameValid: null,
      suffixValid: null,
      addressValid: null,
      emailValid: null,
      contactNoValid: null,
      plantForm: {
        mandatory: [],
        custom: []
      }
    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
  }
  componentWillMount() {
  }

  handleSettingsChange() {
  }
  handleInputChange(e) {
    var newObj = this.state.plantDetails;
    newObj[e.target.name] = e.target.value;
    if (e.target.name === "contactNo") {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ plantDetails: newObj });
      }
      else {
        return null;
      }
      this.setState({ plantDetails: newObj });
    }

    this.setState({ plantDetails: newObj });
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
    var newObj = this.state.plantForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ plantForm: newObj });
  }

  validationCheck() {
    this.state.plantDetails.name === "" ?
      this.setState({ nameError: "Enter plant name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    var suffixPattern = /^(([a-z\-0-9\-A-Z]{3,3}))$/;
    suffixPattern.test(this.state.plantDetails.suffix) === false ?
      this.setState({ suffixError: "Enter Plant Suffix", suffixValid: false }) :
      this.setState({ suffixError: "", suffixValid: true })
    this.state.plantDetails.address === "" ?
      this.setState({ addressError: "Enter plant address", addressValid: false }) :
      this.setState({ addressError: "", addressValid: true })
    this.state.plantDetails.email === "" ?
      this.setState({ emailError: "Enter email", emailValid: false }) :
      this.setState({ emailError: "", emailValid: true })
    this.state.plantDetails.contactNo === "" ?
      this.setState({ contactNoError: "enter Contact No", contactNoValid: false }) :
      this.setState({ contactNoError: "", contactNoValid: true })
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    re.test(this.state.plantDetails.email) === false ?
      this.setState({ emailError: "EMAIL_IS_REQUIRED", emailValid: false }) :
      this.setState({ emailError: "", emailValid: true })
    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(this.state.plantDetails.contactNo) === false ?
      this.setState({ contactNoError: ("Mobile number should of 10 digits"), contactNoValid: false }) :
      this.setState({ contactNoError: "", contactNoValid: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempPlant = JSON.parse(JSON.stringify(this.state.plantDetails))
    if (_this.state.nameValid && _this.state.addressValid && _this.state.contactNoValid && _this.state.suffixValid) {

      if (this.state.plantDetails.code === "New") {
        delete tempPlant.code;
        createPlant(tempPlant,
          function success(data) {
            _this.successAlert("Plant added successfully!");
            setTimeout(() => {
              _this.props.handleCloseModal()
            }, 2000);
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') {
              _this.errorAlert("Duplicate plant name");
              setTimeout(() => {
                _this.props.handleCloseModal()
              }, 2000);
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
            _this.props.handleCloseModal()
          }
        )
      }
      else {
        updatePlant(tempPlant,
          function success(data) {
            _this.successAlert("Plant saved successfully!");
            setTimeout(() => {
              _this.props.handleCloseModal()
            }, 2000);
          }
        )
      }
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
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
          You will not be able to recover this plant!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deletePlant(_this.state.plantDetails,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting plant.");
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
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    let form = (
      <Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Plant Suffix<span className="star">*</span></ControlLabel>
              <FormControl
                placeholder=" Enter suffix"
                type="text"
                name="suffix"
                minLength="3"
                maxLength="3"
                value={this.state.plantDetails.suffix.toUpperCase()}
                onChange={this.handleInputChange}
                className={this.state.suffixValid || this.state.suffixValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Plant Name<span className="star">*</span></ControlLabel>
              <FormControl
                placeholder="Enter plant name"
                type="text"
                name="name"
                value={this.state.plantDetails.name}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Contact No<span className="star">*</span></ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">+91</span>
                <FormControl
                  placeholder=" Enter contact no"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  name="contactNo"
                  pattern="^\d+(?:\.\d{1,3})?$"
                  value={this.state.plantDetails.contactNo}
                  onChange={this.handleInputChange}
                  keyboardType='numeric'
                  className={this.state.contactNoValid || this.state.contactNoValid === null ? "" : "error"}
                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Landline No</ControlLabel>
              <FormControl
                type="text"
                name="telephone"
                placeholder="Enter landline no"
                value={this.state.plantDetails.telephone}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Latitude</ControlLabel>
              <FormControl
                placeholder=" Enter latitude"
                type="text"
                name="latitude"
                value={this.state.plantDetails.latitude}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Longitude</ControlLabel>
              <FormControl
                placeholder="Enter longitude"
                type="text"
                name="longitude"
                value={this.state.plantDetails.longitude}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup>
              <ControlLabel>Plant Address<span className="star">*</span></ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={3}
                placeholder=" Enter plant address"
                type="text"
                name="address"
                value={this.state.plantDetails.address}
                onChange={this.handleInputChange}
                style={{ color: this.state.addressValid || this.state.addressValid === null ? "" : errorColor, borderColor: this.state.addressValid || this.state.addressValid === null ? "" : errorColor }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <center><h5 className="text-danger">{this.state.formError}</h5></center>
            <div className="section-header"></div>
            <OverlayTrigger placement="top" overlay={save}>
              <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Row>
    );
    return (
      <div className="main-content">
        <Grid fluid>
          {this.state.alert}
          <Col xs={12}>{form}</Col>
        </Grid>
      </div>
    )
  }
}

export default PlantFormComponent;