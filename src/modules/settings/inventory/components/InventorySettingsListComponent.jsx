import React, { Component } from "react";
import ReactTable from "react-table";
import { Col, FormControl, OverlayTrigger, Tooltip, FormGroup } from "react-bootstrap";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import "react-select/dist/react-select.css";

import Button from "components/CustomButton/CustomButton.jsx";
import Select from "components/CustomSelect/CustomSelect.jsx";

import { getInventorySettingList, createInventorySetting, updateInventorySetting, deleteInventorySetting } from "../server/InventoryServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { invTypes, pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"

class InventorySettingsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      nameError: null,
      nameValid: false,
      filter: {
        type: null,
        name: "",
        member: null,
        institute: null,
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderTextBoxName = this.renderTextBoxName.bind(this);
    this.renderTextBox = this.renderTextBox.bind(this);
    this.renderCheckBox = this.renderCheckBox.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.addInventory = this.addInventory.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Inventory type", () => this.fetchDataFromServer())
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
    if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    getInventorySettingList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          prop.srNo = key + 1;
          prop.key = key;
          prop.code = prop.code;
          return prop;
        })
        _this.setState({ settings: tempData, filteredData: tempData, loading: false })
      },
      function error() { _this.setState({ settings: [], filteredData: [], loading: false }); }
    );
  }
  validationCheck(obj) {
    obj.name === "" ?
      this.setState({ nameError: "Enter  name", nameValid: false }) :
      this.setState({ nameError: "", nameValid: true })

    setTimeout(this.save(obj), 10);
  }
  save(obj) {
    let _this = this;
    var index = this.state.filteredData.indexOf(obj)
    let temInventory = JSON.parse(JSON.stringify(this.state.filteredData[index]))
    if (temInventory.name === "") {
      _this.setState({ formError: "Please enter inventory name" })
    }
    else {
      (temInventory.code) ? (
        updateInventorySetting(temInventory,
          () => { _this.successAlert("Inventory type saved successfully!") },
          () => { _this.errorAlert("Something went wrong !") }
        )
      ) : (

          createInventorySetting(temInventory,
            (res) => {
              let tempSettings = _this.state.settings;
              tempSettings.push(res);
              _this.setState({ settings: tempSettings, filteredData: tempSettings });
              _this.successAlert("Inventory type added successfully!");
            },
            function error(res) {
              if (res.message === 'Request failed with status code 701') {
              _this.errorAlert("Duplicate inventory type");
              }
              else {
                _this.errorAlert("Something went wrong!")
              }
              _this.props.handleCloseModal()
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
          You will not be able to recover this inventory type!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteInventorySetting(code,
      function success() {
        _this.successAlert("Inventory type deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting inventory type.");
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

  renderSelect(row) {
    return (
      <FormGroup>
        <Select
          clearable={false}
          options={invTypes}
          value={this.state.filteredData[row.index][row.column.id]}
          onChange={(e) => {
            let tempFilteredList = this.state.filteredData;
              tempFilteredList[row.index][row.column.id] = e ?e.value:null;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }

  renderTextBoxName(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          name="name"
          value={this.state.filteredData[cellInfo.index].name}
          style={{ textTransform: "capitalize" }}
          onChange={(e) => {
            let tempFilteredList = this.state.filteredData;
            tempFilteredList[cellInfo.index].name = e.target.value;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }
  renderTextBox(cellInfo) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          value={this.state.filteredData[cellInfo.index][cellInfo.column.id]}
          onChange={(e) => {
            let tempFilteredList = this.state.filteredData;
            tempFilteredList[cellInfo.index][cellInfo.column.id] = e.target.value;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }

  renderCheckBox(cellInfo) {
    return (
      <FormGroup>
        <input
          type="checkbox"
          checked={this.state.filteredData[cellInfo.index][cellInfo.column.id]}
          onChange={(e) => {
            let tempFilteredList = this.state.filteredData;
            tempFilteredList[cellInfo.index][cellInfo.column.id] = e.target.checked;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }


  addInventory() {
    let tempFilteredList = this.state.filteredData;
    tempFilteredList.push({
      type: "Asset",
      name: "",
      categories: [],
      // isUnique: false,
      isTestEquipment: false,
      // isManufacturing: false,
      // isPurchase: false,
      isCalibration: false,
      // isVerification: false,
      isDieselApplicable: false,
      isMaintenance: false,
      isWarranty: false,
      isInsurance: false,
    });
    this.setState({ tempFilteredList });
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No inventory found. <a role="button" onClick={() => this.addInventory()}>Click here</a> to create one.</div>
          ) : (
              <div className="hsnList">
                <div><b>Note:</b>Please enter comma separated categories. These will appear as a drop down when the corresponding inventory type is selected.</div>
                <ReactTable
                  columns={[
                    { Header: "Sr", accessor: "srNo", width: 50, sortable: false, Cell: (row => { return row.index + 1 }) },
                    { Header: "Type", accessor: "type", sortable: false, Cell: this.renderSelect, width: 125 },
                    { Header: "Categories", accessor: "name", sortable: false, Cell: this.renderTextBoxName },
                    { Header: " Sub Categories (Optional)", accessor: "categories", sortable: false, Cell: this.renderTextBox },
                    { Header: "Cal.", accessor: "isCalibration", width: 75, sortable: false, Cell: this.renderCheckBox },
                    { Header: "Maint.", accessor: "isMaintenance", width: 75, sortable: false, Cell: this.renderCheckBox },
                    { Header: "Warranty", accessor: "isWarranty", width: 75, sortable: false, Cell: this.renderCheckBox },
                    { Header: "Ins.", accessor: "isInsurance", width: 75, sortable: false, Cell: this.renderCheckBox },
                    { Header: "Diesel A.", accessor: "isDieselApplicable", width: 75, sortable: false, Cell: this.renderCheckBox },
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
                    }]}

                  data={this.state.filteredData}
                  minRows={0}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}

                />
                <center><h5 className="text-danger">{this.state.formError}</h5></center>
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
              placeholder="Search by type"
              onChange={(e) => this.filter(e, "type")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by category"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={4} lg={6}>
          <Button pullRight bsStyle="primary" fill
            onClick={() => this.addInventory()}>
            <i className="fa fa-plus" /> Add New Inventory
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

export default InventorySettingsListComponent;