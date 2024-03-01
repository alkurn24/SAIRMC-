import React, { Component } from "react";
import { Row, Col, Tooltip, OverlayTrigger, FormGroup, ControlLabel, FormControl, Tab, Nav, NavItem } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import Select from "components/CustomSelect/CustomSelect.jsx";
import "react-select/dist/react-select.css";
import Moment from "moment";

import Button from "components/CustomButton/CustomButton.jsx";
import TestStepsComponent from "./TestStepsComponent.jsx";

import { selectOptionsDataTypes } from "variables/appVariables.jsx";
import { updateUserForm } from "modules/settings/server/SettingsUserFormServerComm.jsx";
import { createTestCase, getTestCaseSingle, updateTestCase } from "modules/testmgmt/testcase/server/TestCaseServerComm.jsx";
import { getTestParamsList } from "modules/testmgmt/testparams/server/TestParamsServerComm.jsx";
import { getInventoryList } from "modules/inventory/stores/server/StoresServerComm.jsx";

class TestCaseFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testparams: [],
      assets: [],
      testcase: {
        name: "",
        code: "",
        timeToTest: "",
        pdcTime: "",
        procedureId: "",
        standardPrice: "",
        department: "",
        isCode: "",
        accredation: false,
        radio: "1",
        minQtyReq: "",
        testData: [
          { name: "Observed Value", dataType: "Number", inputType: "Observation" }
        ],
        steps: [],
        user: {},
        diciplines: {
          isBiological: false,
          isChemical: false,
          isElectrical: false,
          isElectronics: false,
          isFluidFlow: false,
          isForensic: false,
          isMechanical: false,
          isNDT: false,
          isPhotometry: false,
          isRadiological: false,
          isThermal: false
        },
      },
      materialList: [],
      materialForm: {
        mandatory: [],
        custom: []
      },
      nameError: false,
      nameValid: null,
    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleDiciplineChange = this.handleDiciplineChange.bind(this);
    this.handleTestStepChange = this.handleTestStepChange.bind(this);
    this.renderEditableName = this.renderEditableName.bind(this);
    this.renderEditableDataType = this.renderEditableDataType.bind(this);
    this.renderEditableInputType = this.renderEditableInputType.bind(this);
  }
  componentWillMount() {
    let _this = this;
    getTestParamsList("",
      function success(res) {
        _this.setState({
          testparams: res.rows.map((prop) => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              name: prop.name
            }
          })
        });
      },
      function () { }
    )
    getInventoryList("assetType=Measuring Instruments",
      function (res) {
        _this.setState({
          assets: res.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name,
              name: prop.name
            }
          })
        })
      },
      function () { }
    )

    if (_this.props.match.params.testcasescode !== 'new') {
      getTestCaseSingle(_this.props.match.params.testcasescode,
        (res) => {
          _this.setState({ testcase: res })
        },
        () => { }
      )
    }
  }
  handleSettingsChange(e) {
    var newObj = this.state.materialForm;
    newObj.custom[parseInt(e.target.name.split("_")[0], 10)].value = e.target.checked;
    this.setState({ materialForm: newObj });
    updateUserForm(this.state.materialForm,
      function success() { },
      function error() { }
    )
  }
  create() {


  }
  validationCheck() {
    this.state.testcase.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    if (_this.state.nameValid) {
      let temp = JSON.parse(JSON.stringify(this.state.testcase))
      if (temp.steps.length > 1) {
        for (let i = 0; i < temp.steps.length; i++) {
          if (temp.steps[i].parameter && temp.steps[i].parameter.id) temp.steps[i].parameter = temp.steps[i].parameter.id
          if (temp.steps[i].testEquipment && temp.steps[i].testEquipment.id) temp.steps[i].testEquipment = temp.steps[i].testEquipment.id
          if (temp.steps[i]._id === "dummy") delete temp.steps[i]._id

          if (i === temp.steps.length - 1) {
            if (this.props.match.params.testcasescode !== 'new') {
              updateTestCase(temp,
                function success(data) {
                  _this.successAlert("Test case saved successfully!");
                },
                function error(data) {
                  _this.successAlert("Error in saving test case.");
                }
              )
            } else {
              createTestCase(temp,
                function success(data) {
                  _this.successAlert("Test case added successfully!");
                  setTimeout(() => {
                    _this.props.history.push("/test/cases");
                  }, 2000);

                },
                function error() {
                  _this.successAlert("Error in creating test case.");
                }
              )
            }
          }
        }
      }
      else {
        _this.setState({ formError: "Please enter test data" })
      }
    }
    else {
      _this.setState({ formError: "Please enter required fields" })
    }
  }
  handleDateChange(name, date) {
    var newtestcaseDetails = this.state.testcase;
    newtestcaseDetails[name] = date._d;
    this.setState({ testcase: newtestcaseDetails });
  }
  handleTestStepChange(steps) {
    var newtestcaseDetails = this.state.testcase;
    newtestcaseDetails.steps = steps;
    this.setState({ testcase: newtestcaseDetails });
  }
  delete(id) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(id)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this test data
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let tempObj = this.state.testcase;
    tempObj.testData.splice(id, 1);
    this.setState({ tempObj });
    this.successAlert("test data deleted successfully!")

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
  handleInputChange(e) {
    var newtestcaseDetails = this.state.testcase;
    newtestcaseDetails[e.target.name] = e.target.value;
    this.setState({ testcase: newtestcaseDetails });
  }

  handleDropDownChange(selectOption, type) {
    var newtestcase = this.state.testcase;
    newtestcase[type] = selectOption ? selectOption.value : null;
    this.setState({ testcase: newtestcase });
  }
  handleCheckedChange(e) {
    var newtestcase = this.state.testcase;
    newtestcase[e.target.name] = e.target.checked;
    this.setState({ testcase: newtestcase, [e.target.name + 'Valid']: true, formError: "" });
  }
  handleDiciplineChange(e) {
    var newtestcase = this.state.testcase;
    newtestcase.diciplines[e.target.name] = e.target.checked;
    this.setState({ newtestcase });
  }
  renderEditableName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          min={0}
          value={this.state.testcase.testData[cellInfo.index] ? this.state.testcase.testData[cellInfo.index][cellInfo.column.id] : 0}
          onChange={(e) => {
            let tempObj = this.state.testcase;
            tempObj.testData[cellInfo.index][cellInfo.column.id] = e.target.value;
            this.setState({ tempObj });

          }}
        />
      </FormGroup>
    );
  }
  renderEditableDataType(cellInfo) {
    return (
      <FormGroup>
        <Select
          name="dataType"
          options={selectOptionsDataTypes}
          value={this.state.testcase.testData[cellInfo.index].dataType}
          onChange={(option) => {
            let tempObj = this.state.testcase;
            tempObj.testData[cellInfo.index].dataType = option ? option.value : null;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  renderEditableInputType(cellInfo) {
    return (
      <FormGroup>
        <Select
          name="inputType"
          options={[
            { value: "Observation", label: "Observation" },
            { value: "Calculation", label: "Calculation" },
            { value: "Constant", label: "Constant" }
          ]}
          value={this.state.testcase.testData[cellInfo.index].inputType}
          onChange={(option) => {
            let tempObj = this.state.testcase;
            tempObj.testData[cellInfo.index].inputType = option ? option.value : null;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Test case list</Tooltip>);
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const add = (<Tooltip id="edit_tooltip">Add new test data</Tooltip>);


    let form = (
      <Row>
        <Col xs={12}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Col xs={12} sm={6} md={4} lg={4}>
              <ControlLabel>Created By: </ControlLabel> {this.state.testcase.user.name} @ {Moment(this.state.testcase.createdAt).format("DD MMM YYYY hh:mm:ss A")}
            </Col>
            {this.props.match.params.testcasescode !== "new" ?
              <Col xs={12} sm={6} md={4} lg={4}>
                <ControlLabel>Last Updated By: </ControlLabel> {this.state.testcase.user.name} @ {Moment(this.state.testcase.updatedAt).format("DD MMM YYYY hh:mm:ss A")}
              </Col>
              : null
            }
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {this.props.match.params.testcasescode !== "new" ?
              <Col xs={12} sm={4} md={3} lg={2}>
                <FormGroup>
                  <ControlLabel>Test Number</ControlLabel>
                  <FormControl
                    disabled={true}
                    type="text"
                    name="code"
                    value={this.state.testcase.code}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              : null
            }
            <Col xs={12} sm={12} md={5} lg={6}>
              <FormGroup>
                <ControlLabel>Test Name<span className="star">*</span> </ControlLabel>
                <FormControl
                  placeholder="Enter name"
                  type="text"
                  name="name"
                  value={this.state.testcase.name}
                  onChange={this.handleInputChange}
                  className={this.state.nameValid || this.state.nameValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={4} md={2} lg={2}>
              <FormGroup>
                <ControlLabel>Procedure Id</ControlLabel>
                <FormControl
                  placeholder="Enter producer id"
                  type="text"
                  name="procedureId"
                  value={this.state.testcase.procedureId}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3} md={2} lg={2}>
              <FormGroup>
                <ControlLabel>IS Code</ControlLabel>
                <FormControl
                  placeholder="Enter Is code"
                  type="text"
                  name="isCode"
                  value={this.state.testcase.isCode}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Col>
          </Col>

          <Col xs={12} sm={12} md={12} lg={12}>
            <Tab.Container id="tabs-with-dropdown" defaultActiveKey="teststeps">
              <div className="clearfix">

                <Col xs={12} sm={12} md={12} lg={12}>
                  <Nav bsStyle="tabs">
                    <NavItem eventKey="teststeps"><i className="" />Test Steps ({this.state.testcase.steps.length})</NavItem>
                    <NavItem eventKey="testdata"><i className="" />Test Data ({this.state.testcase.testData.length})</NavItem>
                  </Nav>
                </Col>

                <Col sm={12}>
                  <Tab.Content animation>
                    <Tab.Pane eventKey="testdata">
                      <Row>
                        <Col xs={12}>
                          {
                            this.state.testcase.testData.length
                              ? (
                                <ReactTable
                                  data={this.state.testcase.testData}
                                  minRows={0}
                                  className="-striped -highlight"
                                  showPaginationTop={false}
                                  showPaginationBottom={false}
                                  sortable={false}
                                  columns={[
                                    {
                                      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
                                        return (<div>{d.index + 1}</div>)
                                      })
                                    }, { Header: "Name", accessor: "name", Cell: this.renderEditableName },
                                    { Header: "Type", accessor: "dataType", Cell: this.renderEditableDataType },
                                    { Header: "Input Type", accessor: "inputType", Cell: this.renderEditableInputType },
                                    {
                                      Header: "", accessor: "_id", width: 30,
                                      Cell: (row => {
                                        return (
                                          <div className="actions-right">
                                            {cookie.load('role') === "admin" ?
                                              <OverlayTrigger placement="top" overlay={trash}>
                                                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.index)} ><span className="fa fa-trash text-danger"></span></Button>
                                              </OverlayTrigger>
                                              : null
                                            }
                                          </div>
                                        )
                                      }),
                                    }
                                  ]}
                                />
                              ) : (
                                <div>No test data found.</div>
                              )
                          }
                          <OverlayTrigger placement="top" overlay={add}>
                            <Button bsStyle="primary" fill icon onClick={() => {
                              var tempObj = this.state.testcase; tempObj.testData.push({ name: "", dataType: "Number", inputType: "Observation" })
                              this.setState({ tempObj })
                            }}>
                              <span className="fa fa-plus"></span>
                            </Button>
                          </OverlayTrigger>
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="teststeps">
                      <Row>
                        <TestStepsComponent
                          testData={this.state.testcase.testData}
                          steps={this.state.testcase.steps}
                          testparams={this.state.testparams}
                          assets={this.state.assets}
                          handleTestStepChange={this.handleTestStepChange}
                          {...this.props}
                        />
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="material">
                      {this.state.materialList.map(function (result) {
                        return <Col xs={12} sm={6} md={4} lg={4}>
                          <input disabled={false} type="checkbox" checked={result.checkbox} /> &nbsp; {result.name}
                        </Col>;
                      })}
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </div>
            </Tab.Container>
          </Col>
        </Col>
      </Row>
    );
    let actions = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <center><h5 className="text-danger">{this.state.formError}</h5></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack} ><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={list}>
          <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/test/cases')} ><span className="fa fa-list"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={save}>
          <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    );
    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form">{form}</div>
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default TestCaseFormComponent;