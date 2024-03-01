import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";
import { Row, Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getMovementList, deleteMovement, } from "modules/movement/server/MovementServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class OutwardListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      filter: {
        category: null,
        movementType: null,
      },
      socket: getSocket(),
      movementList: [],
    };

    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);

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
    // let params = "view=movement&movementType=Outward";
    let params = "view=movement";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.movementType) { params = params + "&movementType=" + this.state.filter.movementType.trim() }
    if (this.state.filter.category) { params = params + "&category=" + this.state.filter.category.trim() }
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
        _this.successAlert("Movement deleted successfully!")
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

  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
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
    var statusCol = { Header: "Status", accessor: "status", sortable: false }
    var categoryCol = { Header: "Category", accessor: "category", sortable: false }
    var outTimeCol = { Header: "Out Time", accessor: "outTime", sortable: false }
    var inTimeCol = { Header: "In Time", accessor: "inTime", sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={view}>
              <Button className="btn-list" bsStyle="success" fill icon href={"#/movements/movement-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
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
    let table = (
      <Col xs={12}>
        {
          !this.state.movementList || !this.state.movementList.length
            ? (
              <div>No outward list found. <a href="#/movements/movement-edit/new">Click here</a> to create one.</div>
            ) : (
              <div>
                <Row>
                  <Col xs={12}>
                    <ReactTable
                      data={this.state.movementList}
                      columns={
                        [srNoCol, typeCol, numberCol, statusCol, categoryCol, timeCol, crateCol, outTimeCol, inTimeCol, actionsCol]
                      }
                      minRows={0}
                      sortable={false}
                      className="-striped -highlight"
                      showPaginationTop={false}
                      showPaginationBottom={true}
                      loading={this.state.loading}
                      pages={this.state.pages}
                      defaultPageSize={defaultPageSize}
                      pageSizeOptions={pageSizeOptionsList}
                      manual
                      onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                      onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                    />
                  </Col>
                </Row>
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
              name="movementType"
              placeholder="Search by type"
              onChange={(e) => this.filter(e, "movementType")}
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
        <Col xs={12} sm={12} md={6} lg={6}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/movements/movement-edit/new")}>
            <i className="fa fa-plus" /> Add New Movement
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


export default OutwardListComponent;