import React, { Component } from "react";
import { Grid, Row, Col, OverlayTrigger, Tooltip, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import SweetAlert from "react-bootstrap-sweetalert";

import { createDeliveryPoint, getDeliveryPointSingle, updateDeliveryPoint, deleteDeliveryPoint } from "../server/DeliveryPointServerComm.jsx";

class DeliveryPointFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      deliverypoint: props.deliveryPoint ? props.deliveryPoint : {
        type: "Delivery Point",
        name: "",
        street_address: "",
        city: "state",
        state: "",

      },
      deliveryPointForm: {
        mandatory: [],
        custom: []
      }
    }
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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
  handleInputChange(e) {
    var newObj = this.state.deliverypoint;
    newObj[e.target.name] = e.target.value;
    this.setState({ customer: newObj });
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
    var newObj = this.state.deliveryPointForm;
    newObj.custom.push({ name: e.toLowercase(), label: e, value: true });
    this.setState({ deliveryPointForm: newObj });
  }
  create() {
    let _this = this;
    createDeliveryPoint(this.state.deliverypoint,
      function success(data) {
        _this.successAlert("Delivery Point added successfully!");
        _this.props.handleCloseModal(data)
      },
      function error(data) {
        _this.errorAlert("Error in creating DeliveryPoint.");
      }
    )
  }
  save() {
    if (!this.state.deliverypoint.code) {
      this.create();
    } else {
      let _this = this;
      updateDeliveryPoint(this.state.deliverypoint,
        function success(data) {
          _this.successAlert("Delivery Point saved successfully!");
        },
        function error(data) {
          _this.errorAlert("Error in saving Delivery Point.");
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
    deleteDeliveryPoint(_this.state.product,
      function success(data) {
        _this.props.history.push("/module/xyz");
      },
      function error(code) {
        _this.errorAlert("Error in deleting DeliveryPoint.");
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
    const back = (<Tooltip id="back_tooltip">Back</Tooltip>);
    const list = (<Tooltip id="list_tooltip">DeliveryPoint List</Tooltip>);

    let form = (
      <Row>
        <Col md={12}>
          <FormGroup>
            <ControlLabel>Delivery Point Name</ControlLabel>
            <FormControl
              type="text"
              name="name"
              value={this.state.deliverypoint.name}
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Delivery Address</ControlLabel>
            <textarea
            className="form-control"
              name="street_address"
              rows={3}
              value={this.state.deliverypoint.street_address}
              onChange={this.handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col md={12}>
          <div className="section-header" style={{ marginBottom: "10px" }}></div>
          {/* <OverlayTrigger placement="top" overlay={back}>
            <Button bsStyle="info" fill icon onClick={this.props.history.goBack} style={{ marginRight: "15px" }}><span className="fa fa-arrow-left"></span></Button>
          </OverlayTrigger> */}
          {/* <OverlayTrigger placement="top" overlay={list}>
            <Button bsStyle="warning" fill icon onClick={() => this.props.history.push('/crm/deliverypoints')} style={{ marginRight: "15px" }}><span className="fa fa-list"></span></Button>
          </OverlayTrigger> */}
          <OverlayTrigger placement="top" overlay={save}>
            <Button bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={this.save}><span className="fa fa-save"></span></Button>
          </OverlayTrigger>
        </Col>
      </Row>
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

export default DeliveryPointFormComponent;