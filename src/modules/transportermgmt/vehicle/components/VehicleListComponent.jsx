import React, { Component } from "react";
import ReactTable from "react-table";
import Select from "components/CustomSelect/CustomSelect.jsx";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import { createVehicle, updateVehicle, deleteVehicle, getVehicleList } from "../server/VehicleServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class VehicleListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverList: [],
      vehicleList: [],
      editObj: null,
      transporter: props.transporter ? this.props.id : this.props.id,
      alert: null,
      nameError: false,
      vehicleNumberError: false,
      nameValid: null,
      vehicleNumberVaild: null,
      socket: getSocket()
    }

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.renderEditableDataVehicleName = this.renderEditableDataVehicleName.bind(this);
    this.renderEditableVehicleNumber = this.renderEditableVehicleNumber.bind(this);
    this.renderEditableDriver = this.renderEditableDriver.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);

  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Vehicle management", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    let _this = this;
    this.getSocketConnection();
    this.fetchDataFromServer();
    if (this.props.transporter !== undefined) {
      getUserList("view=driver&transporter=" + this.props.transporter,
        function success(data) {
          _this.setState({
            driverList: data.rows
          })
        },
      )
    }
  }
  componentWillReceiveProps(newProps) {
    let _this = this;
    this.props = newProps

  }
  fetchDataFromServer() {
    let _this = this;
    var params = "";
    if (this.props.transporter) params = "&transporter=" + this.props.transporter
    getVehicleList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            key: key,
            code: prop.code ? prop.code : "",
            vehicleNumber: prop.vehicleNumber ? prop.vehicleNumber : "",
            name: prop.name ? prop.name : "",
            driver: prop.driver ? prop.driver._id : null,
          };
        })
        _this.setState({ vehicleList: tempData })
      },
      function error() { _this.setState({ vehicleList: [] }); }
    );

  }
  delete(code) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(code)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this vehicle!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteVehicle(code,
      function success() {
        _this.successAlert("Vehicle deleted successfully!")
      },
      function error() {
        _this.errorAlert("Error in deleting vehicle.");
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
          onConfirm={() => { this.setState({ alert: null }); this.fetchDataFromServer() }}
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

  validationCheck(obj) {

    obj.name === null ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    obj.city === "" ?
      this.setState({ vehicleNumberError: "Enter vehicle number", vehicleNumberVaild: false }) :
      this.setState({ vehicleNumberError: "", vehicleNumberVaild: true })
    setTimeout(this.save(obj), 10);
  }
  save(obj) {
    var _this = this;
    var index = this.state.vehicleList.indexOf(obj)
    let tempVehicle = JSON.parse(JSON.stringify(this.state.vehicleList[index]))
    if (this.props.transporter) {
      tempVehicle.transporter = _this.props.transporter
    }
    if (tempVehicle.name === "" && tempVehicle.vehicleNumber === "" && tempVehicle.driver === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempVehicle.name === "") { _this.setState({ formError: "Please enter vehicle name" }) }
    else if (tempVehicle.vehicleNumber === "") { _this.setState({ formError: "Please enter vehicle number" }) }
    else if (tempVehicle.driver === "") { _this.setState({ formError: "Please select driver name" }) }

    else {
      (!obj.code) ? (
        createVehicle(tempVehicle,
          function success() {
            _this.successAlert("Vehicle added successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') {
              _this.errorAlert("Duplicate vehicle name");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      ) :
        (
          updateVehicle(tempVehicle,
            function success() {
              _this.successAlert("Vehicle saved successfully!");
            },
            function error() {
              _this.errorAlert("Error in creating vehicle.");
            }
          )
        )
      _this.setState({ formError: "" })
    }
  }

  renderEditableVehicleNumber(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="vehicleNumber"
          type="text"
          placeholder="Enter vehicle number"
          value={this.state.vehicleList[cellInfo.index].vehicleNumber.toUpperCase()}
          onChange={(e) => {
            let tempObj = this.state.vehicleList;
            tempObj[cellInfo.index].vehicleNumber = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditableDataVehicleName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="name"
          type="text"
          placeholder="Enter vehicle name"
          value={this.state.vehicleList[cellInfo.index].name}
          onChange={(e) => {
            let tempObj = this.state.vehicleList;
            tempObj[cellInfo.index].name = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  renderEditableDriver(cellInfo) {
    return (
      <FormGroup>
        <Select
          clearable={false}
          name="driver"
          options={this.state.driverList}
          value={this.state.vehicleList[cellInfo.index].driver}
          onChange={(option) => {
            let tempObj = this.state.vehicleList;
            tempObj[cellInfo.index].driver = option ? option.value : null;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const add = (<Tooltip id="edit_tooltip">Add  new vehicle</Tooltip>);
    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :
          <div>
            {this.state.alert}
            {
              this.state.vehicleList.length
                ? (
                  <ReactTable
                    data={this.state.vehicleList}
                    minRows={0}
                    className="-striped -highlight"
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={pageSizeOptionsList}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    sortable={false}
                    columns={[
                      { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
                      { Header: "Vehicle Name", accessor: "name", Cell: this.renderEditableDataVehicleName },
                      { Header: "Vehicle Number", accessor: "vehicleNumber", Cell: this.renderEditableVehicleNumber },
                      { Header: "Driver", accessor: "driver", Cell: this.renderEditableDriver },
                      {
                        Header: "", accessor: "code", width: 60,
                        Cell: (row => {
                          return (
                            <div className="actions-right">
                              <OverlayTrigger placement="top" overlay={save}>
                                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.validationCheck(row.original)}  ><span className="fa fa-save text-success"></span></Button>
                              </OverlayTrigger>
                              {cookie.load('role') === "admin" ?
                                <OverlayTrigger placement="top" overlay={trash}>
                                  <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
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
                  <div>No vehicle list found.</div>
                )
            }
            <center><h5 className="text-danger">{this.state.formError}</h5></center>
            <OverlayTrigger placement="top" overlay={add}>
              <Button bsStyle="primary" fill icon
                onClick={() => {
                  var tempObj = this.state.vehicleList;
                  tempObj.push({ code: null, name: "", vehicleNumber: "", driver: "", })
                  this.setState({ tempObj })
                }}>
                <span className="fa fa-plus"></span>
              </Button>
            </OverlayTrigger>
          </div>
        }
      </div>
    )
  }
}

export default VehicleListComponent;