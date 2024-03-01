import React, { Component } from "react";
import { Grid, Row, Col, Tooltip, OverlayTrigger, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

import { createTestParams, getTestParamsSingle, updateTestParams, deleteTestParams } from "modules/testmgmt/testparams/server/TestParamsServerComm.jsx";

class TestParamsFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      testparams: {
        code: "",
        name: "",
        department: "",
      },
      moduleForm: {
        mandatory: [],
        custom: []
      }
    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.addCustomField = this.addCustomField.bind(this);
    this.inputConfirmAlert = this.inputConfirmAlert.bind(this);
    this.create = this.create.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentWillMount() {
    let _this = this;
    if (_this.props.match.params.testparamscode !== 'new') {
      getTestParamsSingle(_this.props.match.params.testparamscode,
        (res) => {
          _this.setState({ testparams: res })
        },
        () => { }
      )
    }
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
    var newtestparams = this.state.moduleForm;
    newtestparams.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ moduleForm: newtestparams });
  }
  create() {
    let _this = this;
    createTestParams(this.state.testparams,
      function success(data) {
        _this.successAlert("Test params added successfully!");
        setTimeout(() => {
          _this.props.history.push("/test/params");
        }, 2000);
      },
      function error(data) {
        _this.successAlert("Error in creating test params.");
      }
    )
  }
  save() {
    let _this = this;
    console.log(this.props);
    console.log(this.props.match.params.testparamscode);
    // if (_this.props.match.params.testparamscode !== 'new') {
    updateTestParams(_this.state.testparams, this.props.match.params.testparamscode,
      function success(data) {
        _this.successAlert("Test params saved successfully!");
      },
      function error(data) {
        _this.successAlert("Error in saving test params.");
      }
    )
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
          You will not be able to recover this test params!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteTestParams(_this.state.product,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting test params.");
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
  handleInputChange(e) {
    var newTestParams = this.state.testparams;
    newTestParams[e.target.name] = e.target.value;
    this.setState({ testparams: newTestParams });
  }
  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">Test params list</Tooltip>);

    let form = (
      <form>
        {(this.state.testparams.code === '' ? '' : (
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>CODE: {this.state.testparams.code}</ControlLabel>
            </FormGroup>
          </Col>
        ))}

        <Col xs={12}>
          <Col md={4} lg={4} xs={6} sm={12}>
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
          <Col md={4} lg={4} xs={6} sm={12}>
            <FormGroup>
              <ControlLabel>Department</ControlLabel>
              <FormControl
                placeholder="Enter department name"
                type="text"
                name="department"
                value={this.state.testparams.department}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Col>
        <Row>
          <Col xs={12}>
            <div className="section-header"></div>
            <OverlayTrigger placement="top" overlay={back}>
              <Button bsStyle="warning" fill icon onClick={this.props.history.goBack} style={{ marginRight: "15px" }}><span className="fa fa-arrow-left"></span></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={list}>
              <Button bsStyle="primary" fill icon onClick={() => this.props.history.push('/test/params')} style={{ marginRight: "15px" }}><span className="fa fa-list"></span></Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={save}>
              <Button bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.save}><span className="fa fa-save"></span></Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </form>
    );
    return (
      <div className="main-content">
        <Grid fluid>
          {this.state.alert}
          <Card content={form}></Card>
        </Grid>
      </div>
    )
  }
}

export default TestParamsFormComponent;