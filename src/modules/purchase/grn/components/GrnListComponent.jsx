import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";
import Select from "react-select";

import { Modal, Col, OverlayTrigger, Tooltip, FormGroup, FormControl } from 'react-bootstrap';

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import ReceiptNoteModalComponent from "./ReceiptNoteModalComponent.jsx"
import DebitNoteModalComponent from "./DebitNoteModalComponent"
import { getGrnList, deleteGrn } from "../server/GrnServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class GrnListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grnList: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filteredList: [],
      grnListData: [],
      filter: {
        status: "All",
        vendor: null,
      },
      grnCode: null,
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleShowReceiptNoteInvoice = this.handleShowReceiptNoteInvoice.bind(this);
    this.handleShowDebitNoteInvoice = this.handleShowDebitNoteInvoice.bind(this);
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
        this.state.socket.on("grn", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps
    this.getSocketConnection();
    this.fetchDataFromServer()
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()
  }
  fetchDataFromServer() {
    let _this = this;
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.status !== "All") { params = params + "&status=" + this.state.filter.status.trim() }
    if (this.state.filter.vendor) { params = params + "&vendor=" + this.state.filter.vendor.trim() }
    if (this.props.vendorcode) params += "&vendorId=" + this.props.vendorcode
    if (this.props.ordercode) params += "&order=" + this.props.ordercode
    getGrnList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            challanDate: prop.challanDate ? Moment(prop.challanDate).format("DD MMM YYYY") : "",
            status: prop.status ? prop.status : "",
            challanNo: prop.challanNo ? prop.challanNo : null,
            plant: prop.plant ? prop.plant.name : "",
            code: prop.code ? prop.code : "",
            isQa: prop.order ? prop.order.isQa : false,
            number: prop.number ? prop.number : "",
            grnData: prop.grnData ? prop.grnData : "",
            billingAddr: prop.order ? prop.order.billingAddr.name : null,
            order: (
              <a role="button" className="edit-link" href={"#/purchase/orders-edit/" + prop.order.code}>{prop.order.number}</a>),
            vendor: (
              <a role="button" className="edit-link" href={"#/purchase/vendor-edit/" + prop.order.vendor.code}>{prop.order.vendor.name}</a>),
          };
        })
        _this.setState({ grnList: tempData, pages: pages, loading: false })
      },
      function error() { _this.setState({ grnList: [], filteredList: [], loading: false }); }
    );
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }

  handleShowReceiptNoteInvoice(code) {
    this.setState({ showReceiptNoteInvoiceModal: true, grnCode: code })
  }
  handleShowDebitNoteInvoice(code) {
    this.setState({ showInvoiceDebitNoteModal: true, grnCode: code })
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
          You will not be able to recover this GRN!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(code) {
    let _this = this;
    deleteGrn(code,
      function success() {
        _this.successAlert("GRN deleted successfully!")
      },
      function error() {
        _this.successAlert("GRN deleted successfully!")
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

    const debitNote = (<Tooltip id="trash_tooltip">Debit note</Tooltip>);
    const receiptNote = (<Tooltip id="edit_tooltip">Receipt note</Tooltip>);
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    const view = (<Tooltip id="edit_tooltip">View</Tooltip>);

    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var dateCol = { Header: "Date", accessor: "date", width: 130, sortable: false }
    var statusCol = { Header: "Status", accessor: "status", width: 150, sortable: false }
    var codeCol = { Header: "grn number", accessor: "number", width: 120, sortable: false }
    var isQaCol = {
      Header: "QA",
      accessor: "isQa", width: 50,
      Cell: ({ original }) => {
        return (
          original.isQa
            ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
            : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
        )
      },
    }
    var challanCol = { Header: "challan Number", accessor: "challanNo", sortable: false }
    var challanDateCol = {
      Header: "challan Date", accessor: "challanDate", width: 150, sortable: false, Cell: (row => {
        return (
          row.original.challanDate !== null ?
            <div>
              {row.original.challanDate}
            </div>
            :
            <div>--</div>
        )
      })
    }
    // var billingAddrCol = {
    //   Header: "billing Address concerned person", accessor: "billingAddr", width: 300, sortable: false, Cell: (row => {
    //     return (
    //       row.original.billingAddr !== null ?
    //         <div>
    //           {row.original.billingAddr}
    //         </div>
    //         :
    //         <div>--</div>
    //     )
    //   })
    // }
    var plantCol = { Header: "Location", accessor: "plant", width: 200, sortable: false }
    var orderCol = { Header: "PO Number", accessor: "order", width: 120, sortable: false }
    var vendorCol = { Header: "Vendor name", accessor: "vendor", width: 300, sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 120,
      Cell: (row => {
        return (
          <div className="actions-right">
            {row.original.status === "Rejected" || (row.original.status === "Received" && row.original.grnData.filter(x => { return x.rejectedQty > 0 }).length > 0) ?
              <OverlayTrigger placement="top" overlay={debitNote}>
                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowDebitNoteInvoice(row.original.code)} ><span className="fa fa-reorder text-default"></span></Button>
              </OverlayTrigger>
              : null
            }
            {row.original.status === "Received" ?
              <OverlayTrigger placement="top" overlay={receiptNote}>
                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowReceiptNoteInvoice(row.original.code)} ><span className="fa fa-print text-info"></span></Button>
              </OverlayTrigger>
              : null
            }
            {row.original.status !== "Received" ?
              <OverlayTrigger placement="top" overlay={edit}>
                <Button className="btn-list" bsStyle="success" fill icon href={"#/purchase/grn-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
              </OverlayTrigger>
              :
              <OverlayTrigger placement="top" overlay={view}>
                <Button className="btn-list" bsStyle="success" fill icon href={"#/purchase/grn-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
              </OverlayTrigger>
            }
            {cookie.load('role') === "admin" ?
              <OverlayTrigger placement="top" overlay={trash}>
                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      })
    }

    var receiptNoteModal = (
      <Modal
        dialogClassName="large-modal print"
        show={this.state.showReceiptNoteInvoiceModal}
        onHide={() => this.setState({ showReceiptNoteInvoiceModal: false })}>
        <Modal.Body>
          <ReceiptNoteModalComponent
            code={this.state.grnCode}
            {...this.props}
          />
        </Modal.Body>
      </Modal>
    )
    var debitNoteModal = (
      <Modal
        dialogClassName="large-modal print"
        show={this.state.showInvoiceDebitNoteModal}
        onHide={() => this.setState({ showInvoiceDebitNoteModal: false })}>
        <Modal.Body>
          <DebitNoteModalComponent
            code={this.state.grnCode}
            {...this.props}
          />
        </Modal.Body>
      </Modal>
    )
    let table = (
      <Col xs={12}>
        {
          !this.state.grnList || !this.state.grnList.length
            ? (
              <div> No GRN found.</div>
            ) : (
              <div>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <ReactTable
                    data={this.state.grnList}
                    columns={
                      [srNoCol, dateCol, codeCol, statusCol, orderCol, isQaCol, vendorCol, challanCol, challanDateCol, plantCol, actionsCol]
                    }
                    showPaginationTop={false}
                    showPaginationBottom={this.props.view ? false : true}
                    minRows={0}
                    sortable={false}
                    className="-striped -highlight"
                    pageSize={this.state.pageSize}
                    page={this.state.page}
                    pages={this.state.pages}
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={pageSizeOptionsList}
                    onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                    onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                    manual
                  />
                </Col>
              </div>
            )
        }
      </Col>
    );

    let header = (
      <div className="list-header">
        <Col xs={12} sm={4} md={2} lg={2}>
          <FormGroup>
            <Select
              clearable={false}
              placeholder="Select status"
              name="status"
              value={this.state.filter.status}
              options={
                [
                  { value: "All", label: "All" },
                  { value: "Planned", label: "Planned" },
                  { value: "Received", label: "Received" },
                  { value: "In-Progress", label: "In-Progress" },
                  { value: "Approved", label: "Approved" },
                  { value: "Rejected", label: "Rejected" },

                ]
              }
              onChange={(selectOption) => {
                var tempStatus = this.state.filter;
                tempStatus.status = selectOption.value;
                this.fetchDataFromServer();
                this.setState({ tempStatus });
              }}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="vendor"
              placeholder="Search by vendor name"
              onChange={(e) => this.filter(e, "vendor")}
            />
          </FormGroup>
        </Col>

        <Col xs={12} sm={6} md={7} lg={7}>
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
            {receiptNoteModal}
            {debitNoteModal}
            {this.props.view ? null : header}
            {table}
          </div>
        }
      </div>
    )
  }
}

export default GrnListComponent;