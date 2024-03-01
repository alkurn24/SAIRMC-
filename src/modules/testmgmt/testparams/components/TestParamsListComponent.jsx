import React, { Component } from "react";
import ReactTable from "react-table";
import { Modal, FormGroup, ControlLabel, FormControl, Grid, Row, Col } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

import { getTestParamsList } from "modules/testmgmt/testparams/server/TestParamsServerComm.jsx";
import { createTestParams, updateTestParams } from "modules/testmgmt/testparams/server/TestParamsServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize, paginationLabels, paginationStylesList } from "variables/appVariables.jsx"

class TestParamsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testParamsList: [],
      filteredData: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      alert: "",
      settings: props.settings,
      testparams: {
        code: null,
        name: "",
        isChemical: false,
        isMechanical: false,
        isElectrical: false
      },
      moduleForm: {
        mandatory: [],
        custom: []
      }
    };
    this.emptyTestParams = this.state.testparams;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.successAlert = this.successAlert.bind(this);
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
  save() {
    let _this = this;
    if (this.state.testparams.code) {
      updateTestParams(this.state.testparams,
        function success(data) {
          _this.setState({ showtestStepsModal: false, testparams: _this.emptyTestParams });
          _this.successAlert("Test parameter updated successfully!");
        },
        function error(data) {
          _this.successAlert("Error in updating test parameter.");
        }
      )
    } else {
      createTestParams(this.state.testparams,
        function success(data) {
          _this.setState({ showtestStepsModal: false, testparams: _this.emptyTestParams });
          _this.successAlert("Test parameter added successfully!");
        },
        function error(data) {
          _this.successAlert("Error in creating test parameter.");
        }
      )
    }
  }

  handleInputChange(e) {
    var newObj = this.state.testparams;
    if (e.target) {
      newObj[e.target.name] = e.target.value;
      this.setState({ testparams: newObj });
    } else {
      newObj.type = e.value;
      this.setState({ testparams: newObj, formError: null });
      (e.value === "") ?
        this.setState({ [e.target.name + "Valid"]: false }) :
        this.setState({ [e.target.name + "Valid"]: true })
    }
  }
  validationCheck() {
    this.save();
  }
  handleCheckbox(e) {
    var newdata = this.state.testparams;
    newdata[e.target.name] = e.target.checked;
    this.setState({ testparams: newdata });
  }
  componentWillMount() {
    let _this = this;
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    getTestParamsList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            code: prop.code,
            name: prop.name,
            actions: (<a href={"#/test/params-edit/" + prop.code} style={{ color: "blue", borderBottom: "1px solid blue" }}>{prop.name}</a>),
            isChemical: prop.isChemical,
            isMechanical: prop.isMechanical,
            isElectrical: prop.isElectrical,

          };
        })
        _this.setState({ data: tempData, filteredData: tempData, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ data: [], filteredData: [], loading: false }); }
    );
  }
  render() {
    return (
      <div className="main-content" style={{ background: "#e2e2e2fa" }}>
        {this.state.alert}
        <Grid fluid>
          <Modal
            show={this.state.showtestStepsModal}
            onHide={() => this.setState({ showtestStepsModal: false })}>
            <Modal.Header closeButton>
              <Modal.Title>Add/Edit Test Parameter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Parameter Name</ControlLabel>
                    <FormControl
                      placeholder="Enter name"
                      type="text"
                      name="name"
                      value={this.state.testparams.name}
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Deciplines</ControlLabel>
                  </FormGroup>
                </Col>
                <Col md={5} mdOffset={1}>
                  <Checkbox
                    name="isBiological"
                    number="isBiological"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isBiological}
                    label="Biological"
                  />
                  <Checkbox
                    name="isChemical"
                    number="isChemical"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isChemical}
                    label="Chemical"
                  />
                  <Checkbox
                    name="isElectrical"
                    number="isElectrical"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isElectrical}
                    label="Electrical"
                  />
                  <Checkbox
                    name="isElectronics"
                    number="isElectronics"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isElectronics}
                    label="Electronics"
                  />
                  <Checkbox
                    name="isFluidFlow"
                    number="isFluidFlow"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isFluidFlow}
                    label="Fluid Flow"
                  />
                  <Checkbox
                    name="isForensic"
                    number="isForensic"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isForensic}
                    label="Forensic"
                  />
                </Col>
                <Col md={6}>
                  <Checkbox
                    name="isMechanical"
                    number="isMechanical"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isMechanical}
                    label="Mechanical"
                  />
                  <Checkbox
                    name="isNDT"
                    number="isNDT"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isNDT}
                    label="Non Destructive Testing"
                  />
                  <Checkbox
                    name="isPhotometry"
                    number="isPhotometry"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isPhotometry}
                    label="Photometry"
                  />
                  <Checkbox
                    name="isRadiological"
                    number="isRadiological"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isRadiological}
                    label="Radiological"
                  />
                  <Checkbox
                    name="isThermal"
                    number="isThermal"
                    onChange={this.handleCheckbox}
                    isChecked={this.state.testparams.isThermal}
                    label="Thermal"
                  />
                </Col>
              </Row>
            </Modal.Body>
            <Col md={12}>
              <small className="text-danger">{this.state.formError}</small>
            </Col>
            <Modal.Footer>
              <Button bsStyle="success" fill onClick={this.validationCheck}>Save</Button>
            </Modal.Footer>
          </Modal>
          <Row>
            <Col md={12} className="card-margin">
              <Card
                content={
                  <div>
                    <div style={{ position: "absolute", top: "-23px", right: "20px" }}>
                      <Button round bsStyle="primary" fill style={{ height: "45px", width: "45px" }} onClick={() => this.setState({ showtestStepsModal: true })}>
                        <i className="fa fa-plus" style={{ paddingRight: "8px" }} />
                      </Button>
                    </div>
                    {
                      (!this.state.testParamsList || !this.state.testParamsList.length) ? (
                        <div>No test parameters found. <a onClick={() => this.setState({ showtestStepsModal: true })}>Click here</a> to create one.</div>
                      ) : (
                          <div>
                            <ReactTable
                              columns={[
                                {
                                  Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                                    let base = ((this.state.page) * this.state.pageSize)
                                    return (<div>{base + d.index + 1}</div>)
                                  })
                                },
                                { Header: "Parameter Name", accessor: "name", sortable: true },
                                {
                                  Header: "Chemical",
                                  accessor: "isChemical",
                                  Cell: ({ original }) => {
                                    return (
                                      original.isChemical
                                        ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
                                        : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
                                    )
                                  },
                                },
                                {
                                  Header: "Mechanical",
                                  accessor: "isMechanical",
                                  Cell: ({ original }) => {
                                    return (
                                      original.isMechanical
                                        ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
                                        : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
                                    )
                                  },
                                },
                                {
                                  Header: "Electrical",
                                  accessor: "isElectrical",
                                  Cell: ({ original }) => {
                                    return (
                                      original.isElectrical
                                        ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
                                        : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
                                    )
                                  },
                                },
                                { Header: "", accessor: "actions", sortable: false }
                              ]}
                              data={this.state.dataPaginated}
                              minRows={0}
                              sortable={false}
                              className="-striped -highlight"
                              showPaginationTop={false}
                              showPaginationBottom={true}
                              loading={this.state.loading}
                              pageSize={this.state.pageSize}
                              page={this.state.page}
                              pages={this.state.pages}
                              defaultPageSize={defaultPageSize}
                              pageSizeOptions={pageSizeOptionsList}
                              onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                              onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                              manual
                            />
                          </div>
                        )
                    }
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div >
    )
  }
}

export default TestParamsListComponent;