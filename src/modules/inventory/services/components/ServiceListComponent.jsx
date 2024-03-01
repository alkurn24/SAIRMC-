import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';

import { Row, Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getServiceList, deleteService } from "../server/ServiceServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class ServiceListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      data: [],
      filteredData: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filter: {
        type: null,
        name: null,
        category: null,
      },

      socket: getSocket()
    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.renderStoreStatus = this.renderStoreStatus.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("service", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  fetchDataFromServer(state) {
    let _this = this;
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;

    getPlantList(
      "",
      (plants => {
        if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
        if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
        if (this.state.filter.category) { params = params + "&category=" + this.state.filter.category.trim() }
        getServiceList(params,
          function success(data) {
            let pages = Math.ceil(data.count / _this.state.pageSize)
            _this.setState({ plants: plants.rows, data: data.rows, filteredData: data.rows, pages: pages, loading: false })
          },
          function error() { _this.setState({ data: [], filteredData: [], loading: false }); }
        );
      }),
      () => { }
    )

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
          You will not be able to recover this service!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteService(code,
      function success() {
        _this.successAlert("Service deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting service.");
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
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }

  renderStoreStatus(row) {
    let store = this.state.data[row.index].stock.filter(x => { return x.plant.id === row.column.id })[0];
    let index = this.state.data[row.index].stock.indexOf(store);
    if (index !== -1) {
      let cell = this.state.data[row.index].stock[index];
      var value = parseFloat(cell.standardQty)
      return (
        <Row>
          <Col xs={12} sm={8} md={12} lg={12}>
            <div style={{ textAlign: "right" }}>
              {cell.standardQty ? value.toLocaleString("en-IN", { minimumFractionDigits: 3 }) : 0}
            </div>
          </Col>
        </Row>
      )
    } else {
      return "NA"
    }
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    let colDefs = [
      {
        Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
          let base = ((this.state.page) * this.state.pageSize)
          return (<div>{base + d.index + 1}</div>)
        })
      },
      { Header: "Type", accessor: "invType.name", sortable: false },
      { Header: "Category", accessor: "category", sortable: false },
      { Header: "Name", accessor: "name", width: 300, sortable: false },
      { Header: "Owner", accessor: "owner.name", sortable: false },
      { Header: "HSN Code", accessor: "hsn.hsn", sortable: false },

    ]

    // this.state.plants.map(plant => {
    //   return colDefs.push({ Header: plant.name, id: plant.id, Cell: this.renderStoreStatus })
    // })
    colDefs.push({ Header: "Unit", accessor: "unit", sortable: false })
    colDefs.push({
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button className="btn-list" bsStyle="success" fill icon href={"#/inventory/service-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
    })
    let table = (
      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No service items found <a href="#/inventory/service-edit/new">click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  columns={colDefs}
                  data={this.state.filteredData}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  loading={this.state.loading}
                  pageSize={this.state.pageSize}
                  page={this.state.page}
                  pages={this.state.pages}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                  onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                  manual
                />
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
              name="type"
              placeholder="Search by inventory type"
              onChange={(e) => this.filter(e, "type")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="category"
              placeholder="Search by category"
              onChange={(e) => this.filter(e, "category")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={3} lg={3}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/inventory/service-edit/new")}>
            <i className="fa fa-plus" /> Add New Service
						</Button>
        </Col>
      </div>
    );

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
    )
  }
}


export default ServiceListComponent;