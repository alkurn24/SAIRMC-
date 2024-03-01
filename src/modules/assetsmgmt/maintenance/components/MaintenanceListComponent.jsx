import ReactTable from "react-table";
import React, { Component } from "react";
// import moment from "moment";
import { Col, Modal, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import cookie from 'react-cookies';

import Button from "components/CustomButton/CustomButton.jsx";

import MaintenanceLogComponents from "../components/MaintenanceLogComponents.jsx";
import { getMaintenaceLogList, deleteMaintenaceLog } from "../../maintenance/server/MaintenanceLogServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class MaintenanceListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      moduleName: props.moduleName,
      filteredData: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filter: {
        asset: null,
        status: null,
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchFilterData = this.fetchFilterData.bind(this);
    this.handleShowMaintanceLogModal = this.handleShowMaintanceLogModal.bind(this);
    this.handleCloseMaintanceLogModal = this.handleCloseMaintanceLogModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.handleCheckedRadioButton = this.handleCheckedRadioButton.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Maintenancce", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  handleShowMaintanceLogModal(code) {
    this.setState({ showMaintanceLogModal: true, code: code });
  }

  handleCloseMaintanceLogModal() {
    this.setState({ showMaintanceLogModal: false });
    this.fetchDataFromServer();
  }

  handleCheckedRadioButton(e) {
    var eventsDetailsRadio = this.state.eventsDetails;
    eventsDetailsRadio[e.target.name] = e.target.value;
    this.fetchFilterData();
    this.setState({ eventsDetails: eventsDetailsRadio });

  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps
    this.fetchFilterData();
  }

  fetchDataFromServer() {
    let _this = this;
    let params = "view=list";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.props.assetCode) params += "&assetId=" + this.props.assetCode
    if (this.state.filter.asset) { params = params + "&asset=" + this.state.filter.asset.trim() }
    if (this.state.filter.status) { params = params + "&status=" + this.state.filter.status.trim() }
    getMaintenaceLogList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        _this.setState({ data: data.rows, filteredData: data.rows, pages: pages, loading: false })
      }
    );
  }
  fetchFilterData() {

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
          You will not be able to recover this maintenance log!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteMaintenaceLog(code,
      function success() {
        _this.successAlert("Maintenance log deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting maintenance log.");
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
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var numberCol = { Header: " mnt number", accessor: "number", sortable: false }
    var maintenanceDateCol = { Header: "Maintenance Date", accessor: "maintenanceDate", sortable: false }
    var assetNameCol = { Header: "Asset Name", accessor: "asset", sortable: false }
    var statusCol = { Header: "Status", accessor: "status", sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowMaintanceLogModal(row.original.code)} ><span className="fa fa-edit text-primary"></span></Button>
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
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No maintenance log found.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={
                    [srNoCol, numberCol, maintenanceDateCol, statusCol, assetNameCol, actionsCol]
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
      this.props.moduleName !== "log" ?
        <div className="list-header">
          <Col xs={12} sm={6} md={2} lg={2}>
            <FormGroup>
              <FormControl
                type="text"
                name="asset"
                placeholder="Search by asset name"
                onChange={(e) => this.filter(e, "asset")}

              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="status"
                placeholder="Search by status"
                onChange={(e) => this.filter(e, "status")}
              />
            </FormGroup>
          </Col>
        </div>
        : null
    );
    var maintanceLogModel = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showMaintanceLogModal}
      >
        <Modal.Header className="header1">
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showMaintanceLogModal: false, editObj: null })}>{null}</a>
          </div>
          <Modal.Title>Update Maintenance Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaintenanceLogComponents
            {...this.props}
            showMaintanceLogModal={this.state.showMaintanceLogModal}
            handleCloseMaintanceLogModal={this.handleCloseMaintanceLogModal}
            code={this.state.code}
          />
        </Modal.Body>
      </Modal>
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
            {maintanceLogModel}
            {header}
            {table}
          </div>
        }
      </div>
    )
  }
}
export default MaintenanceListComponent;