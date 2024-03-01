import React, { Component } from "react";
import Select from "components/CustomSelect/CustomSelect.jsx";

import SweetAlert from "react-bootstrap-sweetalert";
import cookie from "react-cookies";
import { Modal, Row, Col, FormGroup, FormControl, ControlLabel, OverlayTrigger, Tooltip } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import TestResultComponent from "./TestResultComponent.jsx"
import { errorColor } from 'variables/Variables.jsx';

import { getTestMaterialList } from "modules/testmgmt/testmaterial/server/TestMaterialServerComm.jsx";
import { getCustomerList } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getVendorList } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getDispatchList } from "modules/sales/dispatches/server/DispatchServerComm.jsx";
import { getGrnList } from "modules/purchase/grn/server/GrnServerComm.jsx";
import { getTestCaseList } from "modules/testmgmt/testcase/server/TestCaseServerComm.jsx";
import { createTestReport, getTestReportSingle, updateTestReport, deleteTestReport } from "modules/testmgmt/testreport/server/TestReportServerComm.jsx";

class TestReportFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      report: {
        code: null,
        material: null,
        customer: null,
        vendor: null,
        dispatch: null,
        grn: null,
        plant: null,
        location: "",
        source: "",
        samples: [],
        user: {
          name: cookie.load('user')
        }
      },
      newSample: {
        code: "1",
        description: ""
      },
      materialList: [],
      plantList: [],
      customerList: [],
      vendorList: [],
      dispatchList: [],
      grnList: [],
      testList: [],
      moduleForm: {
        mandatory: [],
        custom: []
      },
      materialValid: null,
      customerValid: null,
      vendorValid: null,
      dispatchValid: null,
      grnValid: null,
      plantValid: null,
      locationValid: null,
      sourceValid: null,
      materialError: false,
      customerError: false,
      vendorError: false,
      dispatchError: false,
      grnError: false,
      plantError: false,
      locationError: false,
      sourceError: false,

    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getTests = this.getTests.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputChangeCustomer = this.handleInputChangeCustomer.bind(this);
    this.fetchCustomerData = this.fetchCustomerData.bind(this);
    this.handleInputChangeVendor = this.handleInputChangeVendor.bind(this);
    this.fetchVendorData = this.fetchVendorData.bind(this);

  }
  componentWillMount() {
    let _this = this;
    getTestMaterialList(
      null,
      (res) => {
        _this.setState({
          materialList: res.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        })
      },
      () => { }
    )
    getPlantList(
      null,
      (res) => {
        _this.setState({
          plantList: res.rows.map(prop => {
            return {
              id: prop.name,
              value: prop.name,
              label: prop.name
            }
          })
        })
      },
      () => { }
    )
    getCustomerList(
      null,
      (res) => {
        _this.setState({
          customerList: res.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        })
      },
      () => { }
    )

    getVendorList(
      null,
      (res) => {
        _this.setState({
          vendorList: res.rows.map(prop => {
            return {
              id: prop.id,
              value: prop.id,
              label: prop.name
            }
          })
        })
      },
      () => { }
    )


    if (_this.props.match.params.testreportcode !== 'new') {
      getTestReportSingle(_this.props.match.params.testreportcode,
        (res) => {
          let tempReport = JSON.parse(JSON.stringify(res))
          let tempTestList = [];
          tempReport.samples.map((sample, key) => {
            sample.tests.map((test, key1) => {
              let obj = {
                testcase: test.testcase.id,
                value: test.testcase.id,
                label: test.testcase.name,
                steps: test.testcase.steps,
                testData: test.testcase.testData,
                result: test.testcase.steps.map(() => {
                  let temp = []
                  test.testcase.testData.map(() => {
                    temp.push("")
                    return
                  })
                  return temp;
                })
              };
              if (tempTestList.indexOf(obj) !== -1) tempTestList.push(obj)
              tempReport.samples[key].tests[key1].value = test.testcase.id;
              tempReport.samples[key].tests[key1].label = test.testcase.name;
              tempReport.samples[key].tests[key1].testData = test.testcase.testData;
              tempReport.samples[key].tests[key1].steps = test.testcase.steps;
              tempReport.samples[key].tests[key1].testcase = test.testcase.id;
            })
            return true;
          })

          _this.setState({ report: tempReport, testList: tempTestList })
        },
        () => { }
      )
    }
  }
  fetchCustomerData(id) {
    var _this = this;
    getDispatchList("customer=" + id,
      (data => {
        _this.setState({
          dispatchList: data.rows.map(prop => {
            return ({
              id: prop.id,
              value: prop.id,
              label: prop.number
            })
          })
        })
      }),
      (() => { })
    )
  }
  fetchVendorData(id) {
    var _this = this;
    getGrnList("vendor=" + id,
      (data => {
        _this.setState({
          getGrnList: data.rows.map(prop => {
            return ({
              id: prop.id,
              value: prop.id,
              label: prop.number
            })
          })
        })
      }),
      (() => { })
    )
  }
  handleSettingsChange() {

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
    var newObj = this.state.moduleForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ moduleForm: newObj });
  }
  create() {
  }
  validationCheck() {

    this.state.report.material === null ?
      this.setState({ materialError: "Select material name", materialValid: false }) :
      this.setState({ materialError: "", materialValid: true })
    this.state.report.plant === null ?
      this.setState({ plantError: "Enter plant name", plantValid: false }) :
      this.setState({ plantError: "", plantValid: true })
    this.state.report.source === "" ?
      this.setState({ sourceError: "Enter source name", sourceValid: false }) :
      this.setState({ sourceError: "", sourceValid: true })
    this.state.report.location === "" ?
      this.setState({ locationError: "Enter location name", locationValid: false }) :
      this.setState({ locationError: "", locationValid: true })

    setTimeout(this.save, 10);
  }
  save() {
    let _this = this;
    if (this.state.materialValid && this.state.plantValid && this.state.locationValid && this.state.sourceValid) {
      var temp = JSON.parse(JSON.stringify(this.state.report))
      temp.material = temp.material ? temp.material.id : null;
      temp.customer = temp.customer ? temp.customer.id : null;
      temp.vendor = temp.vendor ? temp.vendor.id : null;
      temp.dispatch = temp.dispatch ? temp.dispatch.id : null;
      temp.plant = temp.plant.id ? temp.plant.id : temp.plant;
      temp.grn = temp.grn ? temp.grn.id : null
      if (!this.state.report.id) {
        createTestReport(temp,
          function success(data) {
            _this.successAlert("Test report added successfully!");
            setTimeout(() => {
              _this.props.history.push("/test/reports");
            }, 2000);
          },
          function error(data) {
            _this.errorAlert("Error in creating TestReport.");
          }
        )
      } else {
        let _this = this;
        temp.user = temp.user ? temp.user.id : null;
        updateTestReport(temp,
          function success(data) {
            _this.successAlert("Test report saved successfully!");
          },
          function error(data) {
            _this.errorAlert("Error in saving TestReport.");
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
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this test report!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteTestReport(_this.state.product,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting test report.");
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
  getTests(material) {
    let _this = this;
    getTestCaseList(
      "&material=" + material,
      (res) => {
        _this.setState({
          testList: res.rows.map(prop => {
            return {
              testcase: prop.id,
              value: prop.id,
              label: prop.name,
              steps: prop.steps,
              testData: prop.testData,
              result: prop.steps.map(() => {
                let temp = []
                prop.testData.map(() => {
                  temp.push("")
                  return
                })
                return temp;
              })
            }
          })
        })
      },
      () => { }
    )
  }
  handleInputChangeCustomer(e, param) {
    var newObj = this.state.report;
    if (e !== undefined) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      if (param === "customer") {
        this.fetchCustomerData(e.id);
      }
    }
  }
  handleInputChangeVendor(e, param) {
    var newObj = this.state.report;
    if (e !== undefined) {
      newObj[param] = e;
      this.setState({ pricing: newObj, formError: null });
      if (param === "vendor") {
        this.fetchVendorData(e.id);
      }
    }
  }
  handleDropDownChange(type, selectOption) {
    var temp = this.state.report;
    temp[type] = selectOption ? selectOption.value : null;
    this.setState({ report: temp, [type + "Valid"]: true });
    if (type === "material") {
      if (selectOption) this.getTests(selectOption.value)
      else this.setState({ testList: [] })
    }
  }
  handleInputChange(e) {
    var newObj = this.state.report;
    if (e.target) {
      newObj[e.target.name] = e.target.value;
      this.setState({ report: newObj });
    } else {
      newObj.type = e.value;
      this.setState({ report: newObj, formError: null });
      (e.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) :
        this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Test reports list</Tooltip>);

    let TestReportModal = (
      <Row>
        <Modal
          dialogClassName="large-modal"
          show={this.state.showResultModal}
          onHide={() => this.setState({ showResultModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Add/Edit Test Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TestResultComponent {...this.props} samples={this.state.report.samples} index={this.state.selectedSample} />
          </Modal.Body>
        </Modal>
      </Row>
    );

    let form = (
      <Row>
        <Col xs={12}>
          <Col xs={12}>
            {this.props.match.params.testreportcode !== "new" ?
              <Col xs={12} sm={4} md={2}><ControlLabel>Code: {this.state.report.number ? this.state.report.number : this.state.report.code}</ControlLabel></Col>
              : null
            }
            <Col xs={12} sm={4} md={8}><ControlLabel>Created By: {this.state.report.user.name}</ControlLabel></Col>
          </Col>
          <Col xs={12}>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Test Material <span className="star">*</span> </ControlLabel>
                <Select
                  placeholder="Select material"
                  name="material"
                  value={this.state.report.material && this.state.report.material.id ? this.state.report.material.id : this.state.report.material}
                  options={this.state.materialList}
                  onChange={(selectOption) => this.handleDropDownChange("material", selectOption)}
                  style={{ color: this.state.materialValid || this.state.materialValid === null ? "" : errorColor, borderColor: this.state.materialValid || this.state.materialValid === null ? "" : errorColor }}
                />
              </FormGroup>
            </Col>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Plant <span className="star">*</span> </ControlLabel>
                <Select
                  cla
                  placeholder="Select plant"
                  name="plant"
                  value={this.state.report.plant}
                  options={this.state.plantList}
                  onChange={(selectOption) => this.handleDropDownChange("plant", selectOption)}
                  style={{ color: this.state.plantValid || this.state.plantValid === null ? "" : errorColor, borderColor: this.state.plantValid || this.state.plantValid === null ? "" : errorColor }}
                />
              </FormGroup>
            </Col>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Location <span className="star">*</span> </ControlLabel>
                <FormControl
                  placeholder="Enter location"
                  name="location"
                  value={this.state.report.location}
                  onChange={this.handleInputChange}
                  className={this.state.locationValid || this.state.locationValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Source <span className="star">*</span> </ControlLabel>
                <FormControl
                  placeholder="Enter source"
                  name="source"
                  value={this.state.report.source}
                  onChange={this.handleInputChange}
                  className={this.state.sourceValid || this.state.sourceValid === null ? "" : "error"}
                />
              </FormGroup>
            </Col>
          </Col>
        </Col>
        <Col xs={12}>
          <Col xs={12}>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Customer </ControlLabel>
                <Select
                  placeholder="Select customer"
                  name="customer"
                  value={this.state.report.customer && this.state.report.customer.id ? this.state.report.customer.id : this.state.report.customer}
                  options={this.state.customerList}
                  onChange={(selectedOption) => this.handleInputChangeCustomer(selectedOption, 'customer')}
                  style={{ color: this.state.customerValid || this.state.customerValid === null ? "" : errorColor, borderColor: this.state.customerValid || this.state.customerValid === null ? "" : errorColor }}

                />
              </FormGroup>
            </Col>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <ControlLabel>Vendor  </ControlLabel>
                <Select
                  placeholder="Select vendor"
                  name="vendor"
                  value={this.state.report.vendor && this.state.report.vendor.id ? this.state.report.vendor.id : this.state.report.vendor}
                  options={this.state.vendorList}
                  onChange={(selectedOption) => this.handleInputChangeVendor(selectedOption, 'vendor')}
                  style={{ color: this.state.vendorValid || this.state.vendorValid === null ? "" : errorColor, borderColor: this.state.vendorValid || this.state.vendorValid === null ? "" : errorColor }}
                />
              </FormGroup>
            </Col>
            {
              (this.state.report.customer !== null) ?
                (
                  <Col md={3} lg={3} sm={6} xs={12}>
                    <FormGroup>
                      <ControlLabel>Dispatch</ControlLabel>
                      <Select
                        placeholder="Select dispatch"
                        name="dispatch"
                        value={this.state.report.dispatch && this.state.report.dispatch.id ? this.state.report.dispatch.id : this.state.report.dispatch}
                        options={this.state.dispatchList}
                        onChange={(selectOption) => this.handleDropDownChange("dispatch", selectOption)}
                      />
                    </FormGroup>
                  </Col>
                ) : null
            }
            {
              (this.state.report.vendor !== null) ?
                (
                  <Col md={3} lg={3} sm={6} xs={12}>
                    <FormGroup>
                      <ControlLabel>GRN</ControlLabel>
                      <Select
                        placeholder="Select grn"
                        name="grn"
                        value={this.state.report.grn && this.state.report.grn.id ? this.state.report.grn.id : this.state.report.grn}
                        options={this.state.grnList}
                        onChange={(selectOption) => this.handleDropDownChange("grn", selectOption)}
                      />
                    </FormGroup>
                  </Col>
                ) : null
            }
          </Col>
        </Col>
        <Col xs={12}>
          <Col md={12}>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Tests</ControlLabel>
                {
                  this.state.testList.map((prop, key) => {
                    return (
                      <div key={key}>
                        {key + 1}. {prop.label}
                      </div>
                    )
                  })
                }
              </FormGroup>
            </Col>
          </Col>
        </Col>
        <Col xs={12} className="samples">
          <Col md={12}>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Samples</ControlLabel>
                {
                  this.state.report.samples.map((prop, key) => {
                    return (
                      <div key={key}>
                        <ControlLabel>{key + 1}. {prop.code}, {prop.description}</ControlLabel>
                        <Button onClick={() => {
                          this.setState({ showResultModal: true, selectedSample: key })
                        }}>Add test results</Button>
                      </div>
                    )
                  })
                }
              </FormGroup>
            </Col>
            <Col md={2} mdOffset={1}>
              <FormGroup>
                <FormControl
                  name="code"
                  disabled={true}
                  value={this.state.newSample.code}
                  onChange={(e) => {
                    let newObj = this.state.newSample;
                    newObj[e.target.name] = e.target.value;
                    this.setState({ newObj });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={3} lg={3} sm={6} xs={12}>
              <FormGroup>
                <FormControl
                  name="description"
                  value={this.state.newSample.description}
                  onChange={(e) => {
                    let newObj = this.state.newSample;
                    newObj[e.target.name] = e.target.value;
                    this.setState({ newObj });
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={1}>
              <Button fill
                onClick={() => {
                  let newObj = this.state.report;
                  newObj.samples.push({
                    code: this.state.newSample.code,
                    description: this.state.newSample.description,
                    tests: JSON.parse(JSON.stringify(this.state.testList))
                  });
                  let code = (parseInt(newObj.samples.length) + 1);
                  this.setState({ newObj, newSample: { code: code, description: "" } });
                }}
              >Add Sample</Button>
            </Col>
          </Col>
        </Col>
      </Row >
    );
    let actions = (
      <Col xs={12}>
        <center><b><h5 className="text-danger">{this.state.formError}</h5></b></center>
        <OverlayTrigger placement="top" overlay={back}>
          <Button bsStyle="warning" fill icon onClick={this.props.history.goBack} ><span className="fa fa-arrow-left"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={list}>
          <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/test/reports')} ><span className="fa fa-list"></span></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={save}>
          <Button bsStyle="success" fill icon pullRight onClick={this.validationCheck}><span className="fa fa-save"></span></Button>
        </OverlayTrigger>
      </Col>
    )

    return (
      <Row className="card-content">
        {this.state.alert}
        <div className="card-form">{form}</div>
        {TestReportModal}
        <div className="card-footer">{actions}</div>
      </Row>
    );
  }
}

export default TestReportFormComponent;