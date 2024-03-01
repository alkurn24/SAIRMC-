import React, { Component } from "react";
import Moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactQuill from 'react-quill';
import Datetime from "react-datetime";
import 'react-quill/dist/quill.snow.css';
import Select from "components/CustomSelect/CustomSelect.jsx";
import { Row, Col, FormGroup, FormControl, ControlLabel, OverlayTrigger, Tooltip, Tab, Nav, NavItem } from "react-bootstrap";

import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";
import MaintenanceTableComponent from "../components/MaintenanceTableComponent.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";
import { getAssetList } from "../../assets/server/AssetsServerComm.jsx";

import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { updateMaintenaceLog, getMaintenaceLogSingle } from "../server/MaintenanceLogServerComm.jsx";
import { selectOptionsMaintenaceStatus, errorColor } from "variables/appVariables.jsx";

class MaintenanceLogComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      asset: [],
      log: {
        asset: null,
        notes: "",
        maintenanceDate: "",
        totalCost: 0,
        status: null,
        documents: [],
        maintenanceData: [],
      },
      storesList: [],
      plantList: [],
      assetList: [],
      alert: null,
      formError: null,
      assetError: false,
      statusError: false,
      notesError: false,
      descriptionError: false,
      commentsError: false,
      assetValid: null,
      statusValid: null,
      notesValid: null,
      descriptionValid: null,
      commentsValid: null,
    };
    this.save = this.save.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.handleShowMaintanceLogModal = this.handleShowMaintanceLogModal.bind(this);
    this.handleCloseMaintanceLogModal = this.handleCloseMaintanceLogModal.bind(this);
    this.handleMultipleDocumentChange = this.handleMultipleDocumentChange.bind(this);
    this.handleDeleteDocument = this.handleDeleteDocument.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
  }
  handleShowMaintanceLogModal(events) { this.setState({ showMaintanceLogModal: true, events: events }); }
  handleCloseMaintanceLogModal() { this.setState({ showMaintanceLogModal: false }); }
  handleCloseTaskModal(operation, res) {

    this.setState({ showTaskModal: false });
  }
  componentWillMount() {
    var _this = this
    getAssetList(
      "",
      (data => {
        _this.setState({
          assetList: data.rows.map(prop => {
            return ({
              id: prop.id,
              value: prop.id,
              label: prop.name
            })
          })
        })
      }),
      (() => { })
    )

    getMaintenaceLogSingle(_this.props.code,
      (res) => {
        _this.setState({ log: res })
      },
      () => { }
    )

    getInventoryList("",
      function success(data) {
        _this.setState({
          storesList: data.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name ? prop.name : "",
            }
          })
        });

      })
    getPlantList("",
      function success(data) {
        _this.setState({
          plantList: data.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              email: prop.email,
              contactNo: prop.contactNo,
              address: prop.address,
            }
          })
        });

        () => { }
      }
    )
  }
  validationCheck() {
    this.state.log.asset === null ?
      this.setState({ assetError: "Select asset", assetValid: false }) :
      this.setState({ assetError: "", assetValid: true })
    this.state.log.status === null ?
      this.setState({ statusError: "Select asset", statusValid: false }) :
      this.setState({ statusError: "", statusValid: true })
    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    let tempModule = JSON.parse(JSON.stringify(this.state.log));
    if (_this.state.assetValid && _this.state.statusValid) {
      tempModule.asset = this.state.log.asset;
      for (var i = 0; i < tempModule.maintenanceData.length; i++) {
        tempModule.maintenanceData[i].store = tempModule.maintenanceData[i].store ? tempModule.maintenanceData[i].store.id : null;
        tempModule.maintenanceData[i].plant = tempModule.maintenanceData[i].plant ? tempModule.maintenanceData[i].plant.id : null;
      }
      updateMaintenaceLog(tempModule,
        function success() {
          _this.successAlert("Maintenance log saved successfully!");
          setTimeout(() => {
            _this.props.handleCloseMaintanceLogModal();
          }, 2000);

        },
        function error() {
          _this.errorAlert("Error in saving maintenace log.");
        }
      )


    }
    else { this.setState({ formError: "Please enter required fields" }) }
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

  handleInputChange(e, param) {
    var newObj = this.state.log;
    if (!e.target) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
    } else {
      if (e.target.name.indexOf("custom_") !== -1) {
        var key = parseInt(e.target.name.split("_")[1], 10);
        newObj.custom[key] = e.target.value;
        this.setState({ reviews: newObj });
      } else if (e.target.name.indexOf("radio_") !== -1) {
        newObj[e.target.name.split("_")[1]] = e.target.value;
        this.setState({ reviews: newObj });
      } else if (e.target.name.indexOf("reviews_") !== -1) {
        newObj.reviewsData[e.target.name.split("_")[1]][e.target.name.split("_")[2]] = e.target.value;
        this.setState({ reviews: newObj });
      } else {
        newObj[e.target.name] = e.target.value;
        this.setState({ grn: newObj });
      }
    }
  }

  handleMultipleDocumentChange(newDocument) {
    var log = this.state.log;
    log.documents = newDocument.documents;
    this.setState({ log });
  }

  handleDeleteDocument(key) {
    let log = this.state.log;
    log.documents.slice();
    log.documents.splice(key, 1);
    this.setState({ log });
  }

  handleDateChange(name, date) {
    var newdata = this.state.log;
    newdata[name] = date._d;
    this.setState({ reviews: newdata });
  }

  handleNotesChange(html) {
    var newReviews = this.state.log;
    newReviews["notes"] = html;
    this.setState({ reviews: newReviews });
  }

  handleSelectChange(name, selectedOption) {
    let temp = this.state.log;
    temp[name] = selectedOption;
    this.setState({ temp })
  }

  handleDropDownChange(selectOption, type) {
    var newLog = this.state.log;
    newLog[type] = selectOption ? selectOption.value : null;
    this.setState({ log: newLog });
  }

  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    var EditorModules = {
      toolbar: [
        [{ size: [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link']
      ],
      clipboard: {
        matchVisual: false,
      }
    }

    var EditorFormats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link'
    ]

    let form = (
      <Col xs={12}>
        <Row>
          <div>
            <Col xs={12}>
              <Col md={3}>
                <ControlLabel>Maintenance Date</ControlLabel>
                <FormGroup>
                  <Datetime
                    timeFormat={false}
                    closeOnSelect={true}
                    dateFormat="DD-MMM-YYYY"
                    name="maintenanceDate"
                    inputProps={{ placeholder: "Maintenance Date" }}
                    value={this.state.log.maintenanceDate ? Moment(this.state.log.maintenanceDate).format("DD-MMM-YYYY") : null}
                    onChange={(date) => this.handleDateChange("maintenanceDate", date)}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <ControlLabel>Asset Name<span className="star">*</span></ControlLabel>
                <FormGroup>
                  <Select
                    clearable={false}
                    placeholder="Select  Name"
                    name="asset"
                    value={this.state.log.asset}
                    options={this.state.assetList}
                    onChange={(selectOption) => this.handleDropDownChange(selectOption, "asset")}
                    style={{ color: this.state.assetValid || this.state.assetValid === null ? "" : errorColor, borderColor: this.state.assetValid || this.state.assetValid === null ? "" : errorColor }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <ControlLabel>Status<span className="star">*</span></ControlLabel>
                <FormGroup>
                  <Select
                    clearable={false}
                    placeholder="Select status"
                    value={this.state.log.status}
                    options={selectOptionsMaintenaceStatus}
                    onChange={(selectedOption) => this.handleDropDownChange(selectedOption, "status")}
                    style={{ color: this.state.statusValid || this.state.statusValid === null ? "" : errorColor, borderColor: this.state.statusValid || this.state.statusValid === null ? "" : errorColor }}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <ControlLabel>Total Cost</ControlLabel>
                  <div>
                    <span className="input-group">
                      <span className="input-group-addon">₹</span>
                      <FormControl
                        placeholder="Enter totat cost"
                        name="totalCost"
                        type="number"
                        step="0.05" pattern="^\d+(?:\.\d{1,2})?$"
                        value={this.state.log.totalCost ? this.state.log.totalCost : 0.0}
                        onChange={this.handleInputChange}
                      />
                    </span>
                  </div>
                </FormGroup>
              </Col>
            </Col>
            <Col xs={12}>
              <Col xs={12}>
                <ControlLabel> Notes</ControlLabel>
                <FormGroup>
                  <ReactQuill
                    theme="snow"
                    onChange={this.handleNotesChange}
                    value={this.state.log.notes ? this.state.log.notes : ''}
                    modules={EditorModules}
                    formats={EditorFormats}
                    placeholder="Add notes" />
                </FormGroup>
              </Col>
            </Col>
            <Col xs={12}>
              <Tab.Container id="customer-details" defaultActiveKey="maintenance">
                <div className="clearfix">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Nav bsStyle="tabs" className="fix-tab">
                      <NavItem eventKey="maintenance"><i className="fa fa-cog" /> Maintenance</NavItem>
                      <NavItem eventKey="documents"><i className="fa fa-file" /> Documents</NavItem>
                    </Nav>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Tab.Content animation>
                      <Tab.Pane eventKey="maintenance">
                        <Row>
                          <MaintenanceTableComponent
                            log={this.state.log}
                            storesList={this.state.storesList}
                            plantList={this.state.plantList}
                            {...this.props} />
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="documents">
                        <Row>
                          <UploadComponent
                            document
                            type="maintenances"
                            documents={this.state.log.documents}
                            details={this.state.log}
                            dropText="Drop files or click here"
                            handleMultipleDocumentChange={this.handleMultipleDocumentChange}
                            handleDeleteDocument={this.handleDeleteDocument}
                          />
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </div>
              </Tab.Container>
            </Col>

          </div>
        </Row>
      </Col>
    );
    let actions = (
      <Col xs={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <OverlayTrigger placement="top" overlay={save}>
          <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    )
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form ">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    )
  }
}

export default MaintenanceLogComponents;
