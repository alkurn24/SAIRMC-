import React, { Component } from 'react';
import { FormGroup, ControlLabel, Tooltip, OverlayTrigger, Row, Col } from "react-bootstrap";
import Button from 'components/CustomButton/CustomButton.jsx';
import SweetAlert from "react-bootstrap-sweetalert";

import Select from 'react-select';
import Moment from 'moment';

import { getAssetList } from "../../assets/server/AssetsServerComm.jsx";
import { createMaintenaceLog } from "../../maintenance/server/MaintenanceLogServerComm.jsx";

class NewMaintenanceModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddMaintenanceModal: true,
      assets: [],
      maintenance: {
        maintenanceDate: props.maintenanceDate,
        asset: null
      }
    }

    this.fetchData = this.fetchData.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
  }

  componentWillMount() {
    this.fetchData()
  }
  // handleCloseAddMaintenance() { this.setState({ showAddMaintenanceModal: false }); }
  fetchData() {
    let _this = this;
    let params = "&view=dropdown";
    getAssetList(params,
      (data) => { _this.setState({ assets: data.rows }); },
      () => { }
    );
  }

  // handleInputChange(e) {
  //   var maintenance = this.state.maintenance;
  //   maintenance[e.target.name] = e.target.value;
  //   this.setState({ maintenance });
  // }

  handleDropDownChange(type, selectOption) {
    var newMaintenance = this.state.maintenance;
    newMaintenance[type] = selectOption ? selectOption.value : null;
    this.setState({ maintenance: newMaintenance });
  }

  save() {
    let _this = this;
    if (this.state.maintenance.asset) {
      createMaintenaceLog(
        this.state.maintenance,
        () => {
          _this.successAlert("Maintenance created successfully!");
          _this.props.handleCloseMaintenanceModal();
        },
        (res) => {
          _this.errorAlert(res.response.data.message);
        }
      )
    }
  }

  successAlert(message) {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Success"
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >{message}
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
          title="Error"
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >{message}
        </SweetAlert>
      )
    });
  }

  render() {
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    return (
      <Row>
        {this.state.alert}
        <div className="card-form">
          <Row>
            <Col md={8} mdOffset={2}>
              <FormGroup>
                <ControlLabel>Maintenance date: {Moment(this.state.maintenance.maintenanceDate).format('DD-MMM-YYYY')}</ControlLabel>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Asset Name</ControlLabel>
                <Select
                  clearable={false}
                  placeholder="Select assets name"
                  name="assetsName"
                  value={this.state.maintenance.asset}
                  options={this.state.assets}
                  onChange={(selectedOption) => this.handleDropDownChange("asset", selectedOption)}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <div className="card-footer">
          <Col xs={12} sm={12} md={12} lg={12}>
            <div style={{ marginBottom: "10px" }} />
            <OverlayTrigger placement="top" overlay={save}>
              <Button bsStyle="success" fill icon pullRight style={{ marginLeft: "15px" }} onClick={() => this.save()}>
                <span className="fa fa-save" />
              </Button>
            </OverlayTrigger>
          </Col>
        </div>
      </Row>
    )
  }
}

export default NewMaintenanceModal;