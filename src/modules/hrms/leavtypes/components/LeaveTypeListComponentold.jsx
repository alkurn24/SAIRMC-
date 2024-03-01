import React, { Component } from "react";
import ReactTable from "react-table";
import { Col, FormControl, FormGroup, OverlayTrigger, Tooltip, } from "react-bootstrap";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';

import Button from "components/CustomButton/CustomButton.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"

import { getLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } from "../server/LeaveTypeServerComm.jsx";
import { getSocket } from "js/socket.io.js"

class LeaveTypeListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: false,
      data: [],
      LeaveList: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: false,
      alert: null,
      hsnForm: {
        mandatory: [],
        custom: []
      },
      filter: {
        name: "",
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.renderEditableName = this.renderEditableName.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.addLeaveType = this.addLeaveType.bind(this);
    this.filter = this.filter.bind(this);

  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Leave type", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()
  }

  fetchDataFromServer() {
    let _this = this;
    var params = "";
    if (this.state.filter.leaveType) { params = params + "&leaveType=" + this.state.filter.leaveType.trim() }
    getLeaveTypes(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            code: prop.code ? prop.code : "",
            key: key,
            srNo: key + 1,
            number: prop.number ? prop.number : "",
            leaveType: prop.leaveType ? prop.leaveType : "",
          };
        })
        _this.setState({ LeaveList: tempData })
      },
      function error() { _this.setState({ LeaveList: [] }); }
    );
  }

  save(obj) {
    let _this = this;
    var index = this.state.LeaveList.indexOf(obj)
    let tempLeaveType = JSON.parse(JSON.stringify(this.state.LeaveList[index]))
    if (tempLeaveType.leaveType === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else {
      (tempLeaveType.code) ? (
        updateLeaveType(tempLeaveType,
          function success(res) {
            _this.successAlert("Leave type saved successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 800') {
              _this.successAlert("Leave type added successfully!");
            }
            else if (res.message === 'Request failed with status code 820') {
              _this.errorAlert("Leave type already exist.");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }

        )
      ) : (
          createLeaveType(tempLeaveType,
            function success(res) {
              _this.successAlert("Leave type added successfully!");
            },
            function error(res) {
              if (res.message === 'Request failed with status code 800') {
                _this.successAlert("Leave type added successfully!");
              }
              else if (res.message === 'Request failed with status code 820') {
                _this.errorAlert("Leave type already exist.");
              }
              else {
                _this.errorAlert("Something went wrong!")
              }
            }
          )
        )
      _this.setState({ formError: "" })
    }
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  delete(row) {
    if (!row.original.code) {
      let tempObj = this.state.LeaveList;
      tempObj.pop()
      this.setState({ tempObj, isNew: false })
    } else {
      this.setState({
        isNew: false,
        alert: (
          <SweetAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title="Are you sure?"
            onConfirm={() => this.deleteConfirm(row.original.code)}
            onCancel={() => this.setState({ alert: null })}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="info"
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            showCancel
          >
            You will not be able to recover this leave type!
          </SweetAlert>
        )
      });
    }
  }

  deleteConfirm(code) {
    let _this = this;
    deleteLeaveType(code,
      function success() {
        _this.successAlert("Leave type deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting leave type.");
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


  renderEditableName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          name="type"
          placeholder=" Enter leave type"
          value={this.state.LeaveList[cellInfo.index].leaveType}
          onChange={(e) => {
            let tempObj = this.state.LeaveList;
            tempObj[cellInfo.index].leaveType = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    );
  }

  addLeaveType() {
    if (!this.state.isNew) {
      let tempObj = this.state.LeaveList;
      tempObj.push({
        srNo: this.state.LeaveList.length + 1,
        code: null,
        leavetype: "",

      })
      this.setState({ tempObj, isNew: true })
    }
  }


  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.LeaveList || !this.state.LeaveList.length) ? (
            <div>No leave type found.</div>

          ) : (
              <div className="hsnList">
                <ReactTable
                  columns={[
                    { Header: "SR", accessor: "srNo", width: 50, sortable: false, Cell: (row => { return (<div>{row.index + 1}</div>) }) },
                    { Header: "Type", accessor: "leaveType", sortable: false, Cell: this.renderEditableName },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={save}>
                              <a role="button" className="fa fa-save text-success" onClick={() => this.save(row.original)} >{null}</a>
                            </OverlayTrigger>
                            {
                              cookie.load('role') === "Admin" ?
                                <OverlayTrigger placement="top" overlay={trash}>
                                  <a role="button" className="fa fa-trash text-danger" onClick={() => this.delete(row)} >{null}</a>
                                </OverlayTrigger>
                                : null
                            }
                          </div>
                        )
                      }),
                    }
                  ]}
                  data={this.state.LeaveList}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                />
                <center><h6 className="text-danger">{this.state.formError}</h6></center>

              </div>
            )
        }
      </Col>
    );



    let header = (

      <div className="list-header">
        <Col xs={12} sm={6} md={4} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="type"
              placeholder="Search by leave type"
              onChange={(e) => this.filter(e, "type")}
            />
          </FormGroup>
        </Col>
        < Col xs={12} sm={12} md={12} lg={12}>
          <Button pullRight bsStyle="primary" fill
            onClick={() => this.addLeaveType()}>
            <i className="fa fa-plus" /> Add New Leave Type
						</Button>
        </Col>

      </div>

    )
    return (
      <div>
        {this.state.loading ?
          <div className="loader">Loading...</div>
          :
          <div>
            {this.state.alert}
            {header}
            {table}
          </div>
        }
      </div>
    );
  }
}

export default LeaveTypeListComponent;