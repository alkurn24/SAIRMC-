import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";
import { Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";


import { getSocket } from "js/socket.io.js"
import { getMovementList, deleteMovement } from "modules/movement/server/MovementServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class DieselConsumptionListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      movementList: [],
      filteredList: [],
    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Movement", () => this.fetchDataFromServer())
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
    let params = "view=diesel";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    getMovementList(params,
      (data) => {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempList = data.rows.map((prop) => {
          prop.time = Moment(prop.createdAt).format("DD MMM YYYY hh:mm:ss A");
          prop.inTime = prop.inTime !== undefined ? Moment(prop.inTime).format("DD MMM YYYY hh:mm:ss A") : "-";
          prop.outTime = prop.outTime !== undefined ? Moment(prop.outTime).format("DD MMM YYYY hh:mm:ss A") : "-";
          prop.code = prop.code;
          return prop;
        });
        _this.setState({ movementList: tempList, filteredList: tempList, pages: pages, loading: false })
      },
      () => { _this.setState({ movementList: [], filteredList: [], loading: false }); }
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
          You will not be able to recover this movement!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteMovement(code,
      function success() {
        _this.successAlert("Issue Dieseled deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting movement.");
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

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const view = (<Tooltip id="edit_tooltip">View</Tooltip>);

    var srNoCol = {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var typeCol = { Header: "Type", accessor: "movementType", sortable: false }
    var numberCol = { Header: "mov number", accessor: "number", sortable: false }
    var timeCol = { Header: "Time", accessor: "time", sortable: false }
    var crateCol = { Header: "Created By", accessor: "user.name", sortable: false }
    var dieselCategoryCol = { Header: "Issue To", accessor: "dieselCategory", sortable: false }
    var StatusCol = { Header: "Status", accessor: "status", sortable: false }
    var CategoryCol = { Header: "Category", accessor: "category", sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 30,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={view}>
              <Button className="btn-list" bsStyle="success" fill icon href={"#/inventory/diesel-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
            </OverlayTrigger>
            {/* {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            } */}
          </div>
        )
      }),
    }
    let table = (
      <Col xs={12}>
        {
          !this.state.movementList || !this.state.movementList.length
            ? (
              <div>No List found. <a href="#/inventory/diesel-edit/new">Click here</a> to create one.</div>
            ) : (
              <div>
                <ReactTable
                  data={this.state.movementList}
                  columns={
                    [srNoCol, typeCol, numberCol, timeCol, StatusCol, CategoryCol, dieselCategoryCol, crateCol, actionsCol]
                  }
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
        {/* <Col xs={12} sm={6} md={4} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="type"
              placeholder="Search by type"
              onChange={this.filter}
            />
          </FormGroup>
        </Col> */}
        <Col xs={12} sm={12} md={12} lg={12}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/inventory/diesel-edit/new")}>
            <i className="fa fa-plus" /> Issue Diesel
						</Button>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/inventory/stores-edit/new")}>
            <i className="fa fa-plus" /> Add New Store Item
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


export default DieselConsumptionListComponent;