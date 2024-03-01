import React, { Component } from "react";
import ReactTable from "react-table";
import { Col, FormControl, FormGroup, OverlayTrigger, Tooltip, } from "react-bootstrap";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';

import Button from "components/CustomButton/CustomButton.jsx";

import { getUnitList, createUnit, updateUnit, deleteUnit } from "../server/UnitServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class unitListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      unitList: [],
      unitData: [],
      page: 0,
      pageSize: 10,
      pages: 0,
      loading: false,
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
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.addUnitCode = this.addUnitCode.bind(this);
    this.filter = this.filter.bind(this);
    this.renderTextBox = this.renderTextBox.bind(this);

  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("unit code", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()

  }

  fetchDataFromServer(state) {
    let _this = this;
    let params = "";
    getUnitList(params,
      function success(data) {
        let pages = state && state.pageSize ? Math.ceil(data.count / state.pageSize) : 1
        var tempData = data.rows.map((prop, key) => {
          return {
            code: prop.code ? prop.code : "",
            key: key,
            srNo: key + 1,
            number: prop.number ? prop.number : "",
            particular: prop.particular ? prop.particular : "",
            uom: prop.uom ? prop.uom : "",
            alternativeUom: prop.alternativeUom ? prop.alternativeUom : "",
          };
        })
        _this.setState({ unitList: tempData, data: tempData, pages: pages, loading: false })
      },
      function error() { _this.setState({ unitList: [] }); }
    );
  }

  save(obj) {
    let _this = this;
    // var hsnPattern = /^(([a-z\-0-9\-A-Z]{6,12}))$/;
    var index = this.state.unitList.indexOf(obj)
    let tempUnit = JSON.parse(JSON.stringify(this.state.unitList[index]))
    if (tempUnit.particular === "" && tempUnit.uom === "" && tempUnit.alternativeUom === "") {
      _this.setState({ formError: "Please enter required fields" })
    }
    else if (tempUnit.particular === "") {
      _this.setState({ formError: "Please enter particular" })
    }
    // else if (hsnPattern.test(tempUnit.hsn) === false) {
    //   _this.setState({ formError: "HSN code minimum 6 digit" })
    // }
    else if (tempUnit.uom === "") {
      _this.setState({ formError: "Please enter UOM" })
    }
    else {
      (obj.code) ? (
        updateUnit(tempUnit,
          function success(res) {
            _this.successAlert("Unit saved successfully!");
          },
          function error(res) {
            if (res.message === 'Request failed with status code 800') {
              _this.successAlert("Unit added successfully!");
            }
            else if (res.message === 'Request failed with status code 820') {
              _this.errorAlert("Unit already exit.");
            }
            else {
              _this.errorAlert("Something went wrong!")
            }
          }

        )
      ) : (
          createUnit(tempUnit,
            function success(res) {
              _this.successAlert("Unit added successfully!");
            },
            function error(res) {
              if (res.message === 'Request failed with status code 800') {
                _this.successAlert("Unit added successfully!");
              }
              else if (res.message === 'Request failed with status code 820') {
                _this.errorAlert("Unit already exit.");
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
          You will not be able to recover this unit!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteUnit(code,
      function success() {
        _this.successAlert("Unit deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting Unit.");
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


  renderTextBox(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          value={
            this.state.unitList[cellInfo.index][cellInfo.column.id] === "uom" ?
              this.state.unitList[cellInfo.index][cellInfo.column.id].toUpperCase()
              :
              this.state.unitList[cellInfo.index][cellInfo.column.id]
          }
          onChange={(e) => {
            let tempObj = this.state.unitList;
            tempObj[cellInfo.index][cellInfo.column.id] = e.target.value;
            this.setState({ tempObj })
          }}
        />
      </FormGroup>
    )
  }

  addUnitCode() {
    let _this = this;
    var tempObj = this.state.unitData
    tempObj.push({
      srNo: this.state.unitData.length + 1,
      code: null,
      particular: "",
      uom: "",
      alternativeUom: ""
    })
    this.state.unitList = tempObj.concat(this.state.unitList)
    this.setState({ tempObj })
    this.setState({ unitData: [] });
    _this.setState({
      page: 1,
      pageSize: 25
    })
  }


  filter(e) {
    let tempFilter = this.state.filter;
    if (e.target.value !== "") {
      tempFilter[e.target.name] = new RegExp(e.target.value, "gi");
    } else {
      tempFilter[e.target.name] = null;
    }

    this.setState({ tempFilter });
    this.setState({
      unitList: this.state.data.filter(x => {
        let resultName = true;
        resultName = this.state.filter.name ? x.uom.match(this.state.filter.name) : true;
        return resultName;
      })
    })
  }
  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.unitList || !this.state.unitList.length) ? (
            <div>No Unit found.</div>

          ) : (
              <div className="unitList">
                <ReactTable
                  data={this.state.unitList}
                  columns={[
                    {
                      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page - 1) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "Particular", accessor: "particular", sortable: false, Cell: this.renderTextBox },
                    { Header: "UOM (Unit of Measurement)", accessor: "uom", sortable: false, Cell: this.renderTextBox },
                    { Header: "Alternative UOM", accessor: "alternativeUom", sortable: false, Cell: this.renderTextBox },
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
              name="name"
              placeholder="Search by UOM(Unit of Measurement)"
              onChange={this.filter}
            />
          </FormGroup>
        </Col>
        < Col xs={12} sm={6} md={9} lg={9}>
          <Button pullRight bsStyle="primary" fill
            onClick={() => this.addUnitCode()}>
            <i className="fa fa-plus" /> Add New Unit
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

export default unitListComponent;