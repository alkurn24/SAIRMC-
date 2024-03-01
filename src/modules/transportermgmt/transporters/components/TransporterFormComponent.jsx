import React, { Component } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { FormGroup, ControlLabel, FormControl, Row, Col, Nav, NavItem, Tab, Tooltip, OverlayTrigger } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import UploadComponent from 'components/Upload/UploadComponent.jsx';

import DriverListComponent from '../../driver/components/DriverListComponent.jsx';
import VehicleListComponent from '../../vehicle/components/VehicleListComponent.jsx';
import { createTransporter, updateTransporter, deleteTransporter, getTransporterSingle } from "../server/TransporterServerComm.jsx";

class TransporterFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      transporter: {
        name: "",
        gstin: "",
        code: "New",
        contact: "",
        address: "",
        telephone: "",
        documents: []
      },
      alert: null,
      nameError: false,
      gstinError: false,
      contactError: false,
      addressError: false,
      nameValid: null,
      gstinValid: null,
      addressValid: null,
      contactValid: null,
      transporterForm: {
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
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);

  }
  componentWillMount() {
    let _this = this;
    if (_this.props.match.params.code !== 'new') {
      getTransporterSingle(_this.props.match.params.code,
        (res) => {
          _this.setState({ transporter: res })
        },
        () => { }
      )
    }
  }

  handleSettingsChange() {

  }
  handleInputChange(e) {
    var newObj = this.state.transporter;
    newObj[e.target.name] = e.target.value;
    if ((e.target.name === "contact") || (e.target.name === "telephone")) {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ transporter: newObj });
      }
      else {
        return null;
      }
    }
    this.setState({ transporter: newObj });
  }
  handleMultipleDocumentChange(newDocument) {
    var transporter = this.state.transporter;
    transporter.documents = newDocument.documents;
    this.setState({ transporter });
  }
  handleDeleteDocument(key) {
    let transporter = this.state.transporter;
    transporter.documents.slice();
    transporter.documents.splice(key, 1);
    this.setState({ transporter });
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
    var newObj = this.state.transporterForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ transporterForm: newObj });
  }
  validationCheck() {

    this.state.transporter.address === "" ?
      this.setState({ addressError: "Enter address", addressValid: false }) :
      this.setState({ addressError: "", addressValid: true })
    var gstPattern = /^(([a-z\-0-9\-A-Z]{15,15}))$/;
    gstPattern.test(this.state.transporter.gstin) === false ?
      this.setState({ gstinError: "Enter gstin", gstinValid: false }) :
      this.setState({ gstinError: "", gstinValid: true })
    this.state.transporter.name === "" ?
      this.setState({ nameError: "Enter  name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })

    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(this.state.transporter.contact) === false ?
      this.setState({ contactError: ("Mobile number should be 10 digits"), contactValid: false }) :
      this.setState({ contactError: "", contactValid: true })
    setTimeout(this.save, 10);
  }

  save() {
    var _this = this;
    let tempTransporter = JSON.parse(JSON.stringify(this.state.transporter))
    if (_this.state.contactValid && _this.state.nameValid && _this.state.addressValid) {
      if (_this.state.transporter.code === "New") {
        delete tempTransporter.code;
        createTransporter(tempTransporter,
          function success(data) {
            _this.successAlert("Transporter added successfully!");
            setTimeout(() => {
              _this.setState({ transporter: data })
              _this.props.history.push("/transporter/transporters-edit/" + data.code)
            }, 2000);

          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') {
              _this.errorAlert("Duplicate transporter name");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      } else {
        updateTransporter(tempTransporter,
          function success() {
            _this.successAlert("Transporter saved successfully!");
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
          You will not be able to recover this transporter!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteTransporter(_this.state.transporter,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting transporter.");
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

    const Back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const List = (<Tooltip id="list_tooltip">Transporter list</Tooltip>);
    const Save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    let form = (
      <div>
        <Col xs={12}>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Transporter Name <span className="star">*</span></ControlLabel>
              <FormControl
                type="text"
                name="name"
                placeholder="Enter name"
                value={this.state.transporter.name}
                onChange={this.handleInputChange}
                className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>GSTIN</ControlLabel>
              <FormControl
                type="text"
                name="gstin"
                minLength="15"
                maxLength="15"
                placeholder="Enter GSTIN"
                value={this.state.transporter.gstin.toUpperCase()}
                onChange={this.handleInputChange}
              //className={this.state.gstinValid || this.state.gstinValid === null ? "" : "error"}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Mobile No<span className="star">*</span></ControlLabel>
              <span className="input-group">
                <span className="input-group-addon">+91</span>
                <FormControl
                  type="text"
                  name="contact"
                  minLength="10"
                  maxLength="10"
                  placeholder="Enter mobile no"
                  value={this.state.transporter.contact}
                  onChange={this.handleInputChange}
                  className={this.state.contactValid || this.state.contactValid === null ? "" : "error"}
                />
              </span>
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <ControlLabel>Landline No</ControlLabel>
              <FormControl
                type="text"
                name="telephone"
                placeholder="Enter landline no"
                value={this.state.transporter.telephone}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <FormGroup>
              <ControlLabel>Address<span className="star">*</span></ControlLabel>
              <FormControl
                componentClass="textarea"
                type="text"
                name="address"
                rows={3}
                placeholder="Enter address"
                value={this.state.transporter.address}
                onChange={this.handleInputChange}
                className={this.state.addressValid || this.state.addressValid === null ? "" : "error"}
              />
            </FormGroup>

          </Col>
        </Col>
        <Col xs={12}>
          {
            this.state.transporter.code !== 'New' ? (
              <div>
                <h6 className="section-header">Transporter Details</h6>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Tab.Container id="transporter-details" defaultActiveKey="driver">
                    <Row className="clearfix">
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Nav bsStyle="tabs">
                          <NavItem eventKey="driver" className=" "><i className="fa fa-user" /> Driver</NavItem>
                          <NavItem eventKey="vehicle" className=""><i className="fa fa-truck" /> Vehicle</NavItem>
                          <NavItem eventKey="documents" className=""><i className="fa fa-file" /> Documents</NavItem>
                        </Nav>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Tab.Content animation>
                          <Tab.Pane eventKey="driver">
                            <DriverListComponent transporter={this.state.transporter} {...this.props}></DriverListComponent>
                          </Tab.Pane>
                          <Tab.Pane eventKey="vehicle">
                            <VehicleListComponent transporter={this.state.transporter.id} {...this.props}></VehicleListComponent>
                          </Tab.Pane>
                          <Tab.Pane eventKey="documents">
                            <Row>
                              <UploadComponent
                                document
                                type="transporters"
                                documents={this.state.transporter.documents}
                                details={this.state.transporter}
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
            ) : ""
          }
        </Col>
      </div>
    )
    let actions = (
      <Col xs={12}>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        <OverlayTrigger placement="top" overlay={Back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack}><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={List} style={{ backgroundColor: "red" }}>
          <Button bsStyle="primary" fill icon
            disabled={this.state.settings}
            onClick={() => { return this.props.history.push("/transporter/transporters"); }}>
            <span className="fa fa-list"></span>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={Save}>
          <Button bsStyle="success" fill pullRight icon tooltip="Save" onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>

    )
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    )
  }
}
export default TransporterFormComponent;