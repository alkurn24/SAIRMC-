import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "components/CustomSelect/CustomSelect.jsx";
import { Col, FormGroup, OverlayTrigger, Tooltip, FormControl, ControlLabel } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getUserList } from "modules/settings/usermgmt/server/UserServerComm.jsx";
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getInventorySettingList } from "modules/settings/inventory/server/InventoryServerComm.jsx";
import { getAssetList, deleteAsset } from "../server/AssetsServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class AssetsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      userList: [],
      invTypeList: [],
      plantList: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: false,
      filter: {
        invType: null,
        category: null,
        owner: null,
        name: null,
        plant: null,
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
  }

  getSocketConnection() {
    if (getSocket() && !this.state.socket) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        if (this.state.socket) this.state.socket.on("asset", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    let _this = this;
    this.getSocketConnection();
    this.fetchDataFromServer();

    getUserList("view=user",
      function success(data) {
        _this.setState({
          userList: data.rows
        })
      },
    )

    getInventorySettingList(
      "view=select",
      (data) => { _this.setState({ invTypeList: data.rows }) },
      () => { }
    )

    getPlantList(
      "view=select",
      (data) => { _this.setState({ plantList: data.rows }) },
      () => { }
    )
  }

  fetchDataFromServer(state) {
    let _this = this;
    let params = "view=list";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.invType) { params = params + "&invType=" + this.state.filter.invType; }
    if (this.state.filter.category) { params = params + "&category=" + this.state.filter.category; }
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name; }
    if (this.state.filter.owner) { params = params + "&owner=" + this.state.filter.owner; }
    if (this.state.filter.plant) { params = params + "&plant=" + this.state.filter.plant; }
    getAssetList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        _this.setState({ data: data.rows, filteredData: data.rows, pages: pages, loading: false })
      },
      function error(error) {
        _this.setState({ data: [], filteredData: [], loading: false });
      }
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
          You will not be able to recover this inventory!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteAsset(code,
      function success() {
        _this.successAlert("Asset deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting inventory.");
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

  handleDropDownChange(selectOption, type) {
    var newFilter = this.state.filter;
    newFilter[type] = selectOption ? selectOption.value : null;
    this.fetchDataFromServer();
    this.setState({ filter: newFilter });
  }

  filter(e, name) {
    let tempFilter = this.state.filter;
    if (name === "invType") { tempFilter[name] = e ? e.value : null }
    else if (name === "category") { tempFilter[name] = e ? e.target.value : null }
    else if (name === "name") { tempFilter[name] = e ? e.target.value : null }
    else if (name === "owner") { tempFilter[name] = e ? e.value : null }
    else if (name === "plant") { tempFilter[name] = e ? e.value : null }
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);

    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var numberCol = { Header: "ast number", accessor: "number", sortable: false }
    var typeCol = { Header: "Type", accessor: "type", width: 200, sortable: false }
    var categoryCol = { Header: "Category", accessor: "category", width: 120, sortable: false }
    var nameCol = { Header: "Name", accessor: "name", width: 250, sortable: false }
    var statusCol = { Header: "Status", accessor: "status", sortable: false }
    var ownerCol = { Header: "Owner", accessor: "owner", sortable: false }
    var hsnCol = { Header: "HSN Code", accessor: "hsn", sortable: false }
    var unitCol = { Header: "Unit", accessor: "unit", sortable: false }
    var locationCol = { Header: "Location", accessor: "plant", sortable: false };
    var actionsCol = {
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <a role="button" className="fa fa-edit text-primary" href={"#/assets/assets-edit/" + row.original.code} >{null}</a>
            </OverlayTrigger>
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <a role="button" className="fa fa-trash text-danger" onClick={() => this.delete(row.original.code)} >{null}</a>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      }),
    }

    let table = (
      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No assets found. <a href="#/assets/assets-edit/new">Click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={[
                    srNoCol, numberCol, typeCol, categoryCol, nameCol, ownerCol, statusCol, hsnCol, unitCol, locationCol, actionsCol
                  ]}

                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  page={this.state.page}
                  pageSize={this.state.pageSize}
                  pages={this.state.pages}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  manual
                  // onFetchData={this.fetchDataFromServer}
                  onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                  onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                />
              </div>
            )
        }
      </Col>
    );
    let header = (
      this.props.moduleName !== "log" ?
        <div className="list-header">
          <Col xs={12} sm={6} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <Select
                clearable={false}
                placeholder="Select type"
                name="invType"
                value={this.state.filter.invType ? this.state.filter.invType : null}
                options={this.state.invTypeList}
                onChange={(selectOption) => this.filter(selectOption, "invType")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Category</ControlLabel>
              <FormControl
                type="text"
                name="category"
                placeholder="Search by category"
                onChange={(e) => this.filter(e, "category")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Asset Name</ControlLabel>
              <FormControl
                type="text"
                name="name"
                placeholder="Search by name"
                onChange={(e) => this.filter(e, "name")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Owner</ControlLabel>
              <Select
                clearable={false}
                placeholder="Select Owner"
                name="owner"
                value={this.state.filter.owner ? this.state.filter.owner.id : null}
                options={this.state.userList}
                onChange={(selectOption) => this.filter(selectOption, "owner")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/assets/assets-edit/new")}>
              <i className="fa fa-plus" /> Add New Asset
						</Button>
          </Col>
        </div>
        : null

    );

    return (

      <div>
        {this.state.alert}
        {header}
        {table}
      </div>

    )
  }
}


export default AssetsListComponent;