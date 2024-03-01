import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

import { createModule, getModuleList, getModuleSingle, updateModule, deleteModule } from "templates/server/TemplateServerComm.jsx";

class CustomerFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      obj: {},
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
  }
  componentWillMount() {
    // TODO: Get the custom form from the server
    // TODO: if edit function get the customer from the server
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
          cancelBtnBsStyle="info"
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
    let _this = this;
    createModule(this.state.obj,
      function success(data) {
        _this.successAlert("Module added successfully!");
      },
      function error(data) {
        _this.successAlert("Error in creating Module.");
      }
    )
  }
  save() {
    if (this.state.obj._id) {
      this.create();
    } else {
      let _this = this;
      updateModule(this.state.obj,
        function success(data) {
          _this.successAlert("Module saved successfully!");
        },
        function error(data) {
          _this.successAlert("Error in saving Module.");
        }
      )
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
          You will not be able to recover this product!
        </SweetAlert>
      )
    });
  }
  deleteConfirm() {
    let _this = this;
    deleteModule(_this.state.product,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting Module.");
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
    let _this = this;
    let settings =
      <Row>
        <Col md={12}>
          <label>Mandatory Fields</label>
          <Col md={10} mdOffset={1}>{
            this.state.customerForm.mandatory.map(function (item, key) {
              return (
                <Checkbox disabled key={key} name={item.name} isChecked={true} number={item.name} label={item.label} onChange={_this.handleSettingsChange} />
              )
            })
          }</Col>
          <hr />
          <label>Custom Fields</label>
          <Col md={10} mdOffset={1}>{
            this.state.customerForm.custom.map(function (item, key) {
              return (
                <Checkbox key={key} name={item.name} isChecked={item.value} number={item.name} label={item.label} onChange={_this.handleSettingsChange} />
              )
            })
          }</Col>
          <Button className="col-md-8 col-md-offset-2" onClick={this.addCustomField}>Add new custom field</Button>
        </Col>
      </Row>
    let list =
      <div>List panel</div>
    let sidePanel = this.state.settings ? settings : list;
    let form =
      <div>Main form</div>
    return (
      <div className="main-content">
        <Grid fluid>
          {this.state.alert}
          <Row>
            <Col md={3}>
              <Card content={sidePanel}></Card>
            </Col>
            <Col md={9}>
              <Card content={form}></Card>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default CustomerFormComponent;