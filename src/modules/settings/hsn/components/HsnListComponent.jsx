import React, { Component } from "react";
import ReactTable from "react-table";
import { Col, FormControl, FormGroup, OverlayTrigger, Tooltip, } from "react-bootstrap";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';

import Button from "components/CustomButton/CustomButton.jsx";

import { getHsnList, createHsn, updateHsn, deleteHsn } from "../server/HsnServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class HsnListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      hsnList: [],
      hsnData: [],
      page: 0,
      pageSize: 10,
      pages: 0,
      loading: true,
      hsnError: false,
      gstError: false,
      hsnValid: null,
      gstValid: null,
      alert: null,
      hsnForm: {
        mandatory: [],
        custom: []
      },
      filter: {
        hsn: null,
        updated: false
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
    this.renderEditableGst = this.renderEditableGst.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.addHSNCode = this.addHSNCode.bind(this);
    this.filter = this.filter.bind(this);

  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("hsn code", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()

  }

  fetchDataFromServer() {
    let _this = this;
    let params = "";
    if (this.state.filter.hsn) { params = params + "&hsn=" + this.state.filter.hsn.trim() }
    getHsnList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            code: prop.code ? prop.code : "",
            key: key,
            srNo: key + 1,
            number: prop.number ? prop.number : "",
            hsn: prop.hsn ? prop.hsn : "",
            gst: prop.gst ? prop.gst : "",

          };
        })
        _this.setState({ hsnList: tempData, data: tempData, loading: false })
      },
      function error() { _this.setState({ hsnList: [] }); }
    );
  }

  save(obj) {
    let _this = this;
    // var hsnPattern = /^(([a-z\-0-9\-A-Z]{6,12}))$/;
    var index = this.state.hsnList.indexOf(obj)
    let tempHsn = JSON.parse(JSON.stringify(this.state.hsnList[index]))
    if (tempHsn.hsn === "" && tempHsn.gst === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempHsn.hsn === "") {
      _this.setState({ formError: "Please enter HSN code" })
    }
    // else if (hsnPattern.test(tempHsn.hsn) === false) {
    //   _this.setState({ formError: "HSN code minimum 6 digit" })
    // }
    else if (tempHsn.gst === "") {
      _this.setState({ formError: "Please enter gst" })
    }

    else {
      (obj.code) ? (
        updateHsn(tempHsn,
          function success(res) {
            _this.successAlert("HSN code saved successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 800') {
              _this.successAlert("HSN code added successfully!");
            }
            else if (res.message === 'Request failed with status code 820') {
              _this.errorAlert("HSN Code already exit.");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }

        )
      ) : (
          createHsn(tempHsn,
            function success(res) {
              _this.successAlert("HSN code added successfully!");
            },
            function error(res) {
              if (res.message === 'Request failed with status code 800') {
                _this.successAlert("HSN code added successfully!");
              }
              else if (res.message === 'Request failed with status code 820') {
                _this.errorAlert("HSN code already exit.");
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
          You will not be able to recover this HSN code!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteHsn(code,
      function success() {
        _this.successAlert("HSN code deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting HSN code.");
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
          name="hsn"
          // minLength={6}
          // maxLength={12}
          placeholder=" Enter HSN code"
          value={this.state.hsnList[cellInfo.index].hsn}
          onChange={(e) => {
            let tempObj = this.state.hsnList;
            tempObj[cellInfo.index].hsn = e.target.value;
            this.setState({ tempObj })
          }}

        />
      </FormGroup>
    );
  }
  renderEditableGst(cellInfo) {
    return (
      <FormGroup>
        <div>
          <span className="input-group">
            <FormControl
              name="gst"
              type="text"
              placeholder="0"
              value={this.state.hsnList[cellInfo.index].gst}
              onChange={(e) => {
                let tempObj = this.state.hsnList;
                tempObj[cellInfo.index].gst = e.target.value;
                this.setState({ tempObj })
              }}
            />
            <span className="input-group-addon">%</span>
          </span>
        </div>
      </FormGroup>
    );
  }

  addHSNCode() {
    let _this = this;
    var tempObj = this.state.hsnData
    tempObj.push({
      srNo: this.state.hsnData.length + 1,
      code: null,
      hsn: "",
      gst: ""
    })
    this.state.hsnList = tempObj.concat(this.state.hsnList)
    this.setState({ tempObj })
    this.setState({ hsnData: [] });
    _this.setState({
      page: 1,
      pageSize: 25
    })
  }

  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.hsnList || !this.state.hsnList.length) ? (
            <div>No HSN found.</div>

          ) : (
              <div className="hsnList">
                <ReactTable
                  data={this.state.hsnList}
                  columns={[
                    {
                      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
                        return (<div>{d.index + 1}</div>)
                      })
                    }, { Header: "HSN Code", accessor: "hsn", sortable: false, Cell: this.renderEditableName },
                    { Header: "Gst (%)", accessor: "gst", sortable: false, Cell: this.renderEditableGst },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={save}>
                              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.save(row.original)} ><span className="fa fa-save text-success"></span></Button>
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

                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  loading={this.state.loading}
                  pages={this.state.pages}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}

                />
                <center><h5 className="text-danger">{this.state.formError}</h5></center>
              </div>
            )
        }
      </Col>
    );
    let header = (

      <div className="list-header">
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="hsn"
              placeholder="Search by HSN code"
              onChange={(e) => this.filter(e, "hsn")}
            />
          </FormGroup>
        </Col>
        < Col xs={12} sm={6} md={9} lg={9}>
          <Button pullRight bsStyle="primary" fill
            onClick={() => this.addHSNCode()}>
            <i className="fa fa-plus" /> Add New HSN
						</Button>
        </Col>

      </div>

    )
    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
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

export default HsnListComponent;