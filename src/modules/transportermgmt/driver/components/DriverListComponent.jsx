import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from "axios";
import { FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { backendURL } from 'variables/appVariables.jsx';
import { getUserList, createUser, deleteUser } from "../server/DriverServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"



class AddressesListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driverList: [],
      editObj: null,
      transporter: props.transporter ? this.props.id : this.props.id,
      nameError: false,
      alert: null,
      roleError: false,
      contactError: false,
      nameValid: null,
      roleValid: null,
      contactVaild: null,
      socket: getSocket()

    }

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);

    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.validationCheck = this.validationCheck.bind(this);

    this.renderEditableName = this.renderEditableName.bind(this);
    this.renderEditableContact = this.renderEditableContact.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("user", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    let _this = this;
    let id;
    var params;
    if (this.props.transporter) id = this.props.transporter.id
    params = "view=transporter";
    if (this.props.transporter) params += "&transporter=" + this.props.transporter.id
    getUserList(params,
      function success(data) {
        _this.setState({
          driverList: data.rows.filter(x => { return x.transporter === id })
        })
      },
    )
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
          You will not be able to recover this driver!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(id) {
    let _this = this;
    deleteUser(id,
      function success() {
        _this.successAlert("Driver deleted successfully!")
      },
      function error(id) {
        _this.errorAlert("Error in deleting driver.");
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
    obj.name === "" ?
      this.setState({ nameError: "Enter name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })
    obj.role === null ?
      this.setState({ roleError: "Enter role", roleValid: false }) :
      this.setState({ roleError: "", roleValid: true })
    var pattern = /^(([0-9]{10,10}))$/;
    pattern.test(obj.contact) === false ?
      this.setState({ contactError: ("Mobile number should be 10 digits"), contactValid: false }) :
      this.setState({ contactError: "", contactValid: true })
    setTimeout(this.save(obj), 10);
  }
  save(obj) {
    var _this = this;
    var pattern = /^(([0-9]{10,10}))$/;
    var url = backendURL + "users/";
    var index = this.state.driverList.indexOf(obj)
    let tempDriver = JSON.parse(JSON.stringify(this.state.driverList[index]))
    if (this.props.transporter) {
      tempDriver.transporter = _this.props.transporter.id
    }
    if (tempDriver.name === "" && tempDriver.contact === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempDriver.name === "") { _this.setState({ formError: "Please enter name" }) }
    else if (tempDriver.contact === "") { _this.setState({ formError: "Please enter mobile no " }) }
    else if (pattern.test(obj.contact) === false) { _this.setState({ formError: "Mobile number should be 10 digits" }) }

    else {
      (!obj.id) ? (
        createUser(tempDriver,
          function success(data) {
            _this.successAlert("Driver added successfully!");
            setTimeout(() => {
              window.location.reload();
              _this.setState({ driverList: data })
            }, 2000);
          },
          function error(res) {
            if (res.message === 'Request failed with status code 701') {
              _this.errorAlert("Duplicate driver name");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }
        )
      ) :
        (
          axios.put(url + obj.id, tempDriver, { headers: { Authorization: "Bearer " + cookie.load("token") } })
            .then(function (res) {
              console.log(res.data);
              if (res.status === 200) {
                _this.successAlert("Driver saved successfully!");

              }
              function error(res) {
                if (res.message === 'Request failed with status code 701') {
                  _this.errorAlert("Duplicate driver name");
                }
                else {
                  _this.errorAlert("Something went wrong!")
                }
              }
            })

        )
      _this.setState({ formError: "" })
    }
  }
  renderEditableName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="name"
          type="text"
          placeholder="Enter name"
          value={this.state.driverList[cellInfo.index].name}
          onChange={(e) => {
            let tempObj = this.state.driverList;
            tempObj[cellInfo.index].name = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }
  renderEditableContact(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          name="contact"
          type="text"
          placeholder="Enter mobile no"
          minLength="10"
          maxLength="10"
          value={this.state.driverList[cellInfo.index].contact}
          onChange={(e) => {
            const re = /^[0-9\b]+$/;
            let tempObj = this.state.driverList;
            if (e.target.value === '' || re.test(e.target.value)) {
              tempObj[cellInfo.index].contact = e.target.value;
            }
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const add = (<Tooltip id="edit_tooltip">Add new driver</Tooltip>);

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
              this.state.driverList.length
                ? (
                  <ReactTable
                    data={this.state.driverList}
                    minRows={0}
                    className="-striped -highlight"
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={pageSizeOptionsList}
                    showPaginationTop={false}
                    showPaginationBottom={false}
                    sortable={false}
                    columns={[
                      { Header: "Sr", id: "slno", Cell: d => { return <div>{d.index + 1}</div> }, width: 50 },
                      { Header: "Name", accessor: "name", Cell: this.renderEditableName },
                      { Header: "Mobile No", accessor: "contact", Cell: this.renderEditableContact },
                      {
                        Header: "", accessor: "id", width: 60,
                        Cell: (row => {
                          return (
                            <div className="actions-right">
                              <OverlayTrigger placement="top" overlay={save}>
                                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.validationCheck(row.original)}  ><span className="fa fa-save text-success"></span></Button>
                              </OverlayTrigger>
                              {cookie.load('role') === "admin" ?
                                <OverlayTrigger placement="top" overlay={trash}>
                                  <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.id)} ><span className="fa fa-trash text-danger"></span></Button>
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
                  <div>No driver list found.</div>
                )
            }
            <center><h5 className="text-danger">{this.state.formError}</h5></center>
            <OverlayTrigger placement="top" overlay={add}>
              <Button bsStyle="primary" fill icon
                onClick={() => {
                  var tempObj = this.state.driverList;
                  tempObj.push({ id: null, name: "", contact: "", role: "driver", })
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

export default AddressesListComponent;