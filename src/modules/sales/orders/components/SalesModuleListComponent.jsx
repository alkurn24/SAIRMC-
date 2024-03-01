import React, { Component } from "react";
import ReactTable from "react-table";
import _ from "lodash";
import cookie from 'react-cookies';
import Select from "react-select";
import Moment from "moment";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, Row, ProgressBar, OverlayTrigger, Tooltip, FormGroup, FormControl } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getOrderList, deleteOrder, updateOrder } from "modules/sales/orders/server/OrderServerComm.jsx";
import DispatchScheduleModalComponent from "modules/sales/dispatchschedule/components/DispatchScheduleModalComponent.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class SalesModuleListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      moduleName: props.moduleName,
      currency: "₹ ",
      moduleList: [],
      moduleListData: [],
      salesOrder: {
        status: "All",
        customer: null,
        buildingName: "",
        siteAddress: "",
        number: "",
      },
      module: props.module,
      filter: props.filter

    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleShowDispatchModal = this.handleShowDispatchModal.bind(this);
    this.handleCloseDispatchModal = this.handleCloseDispatchModal.bind(this);
    this.delete = this.delete.bind(this);
    this.save = this.save.bind(this);
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
        this.state.socket.on("Sales order", () => this.fetchDataFromServer())
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
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    params = params + "&poavailable=true";
    if (this.state.salesOrder.customer) { params = params + "&customerName=" + this.state.salesOrder.customer.trim() }
    if (this.state.salesOrder.buildingName) { params = params + "&buildingName=" + this.state.salesOrder.buildingName.trim() }
    if (this.state.salesOrder.siteAddress) { params = params + "&siteAddress=" + this.state.salesOrder.siteAddress.trim() }
    if (this.state.salesOrder.number) { params = params + "&number=" + this.state.salesOrder.number.trim() }
    if (this.state.salesOrder.status !== "All") { params = params + "&status=" + this.state.salesOrder.status.trim() }
    if (this.props.code) params += "&order=" + this.props.code
    if (this.props.customercode) params += "&customer=" + this.props.customercode
    getOrderList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let list = data.rows.map((prop) => {
          return ({
            prop: prop,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            poNumber: prop.poNumber ? prop.poNumber : "",
            siteAddress: prop.siteAddress ? prop.siteAddress.name : "",
            buildingName: prop.buildingName ? prop.buildingName : "",
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            status: prop.status ? prop.status : "",
            progress: prop.progress,
            customer: (
              <a role="button" className="edit-link" href={"#/crm/customers-edit/" + prop.customer.code}>{prop.customer ? prop.customer.name : ""}</a>),
            orderData: prop.orderData
          });
        })
        _this.setState({ moduleList: list, pages: pages, loading: false })
      },
      function error() { _this.setState({ moduleList: [], loading: false }); }
    );
  }

  filter(e, name) {
    let tempFilter = this.state.salesOrder;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
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
          You will not be able to recover this order!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteOrder(code,
      function success() {
        _this.successAlert("Order deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting order.");
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

  save(row, status) {
    let _this = this;
    let tempModule = JSON.parse(JSON.stringify(row.prop));
    let tempStatus = row.status;
    tempModule.status = status;
    tempModule.customer = tempModule.customer ? tempModule.customer.id : null;
    tempModule.agent = tempModule.agent ? tempModule.agent.id : null;
    tempModule.contact = tempModule.contact ? tempModule.contact.id : null;
    tempModule.salesPerson = tempModule.salesPerson ? tempModule.salesPerson._id : null;
    tempModule.siteAddress = tempModule.siteAddress ? tempModule.siteAddress.id : null;
    tempModule.billingAddr = tempModule.billingAddr ? tempModule.billingAddr.id : null;
    tempModule.user = tempModule.user ? tempModule.user.id : null;
    for (var i = 0; i < tempModule.orderData.length; i++) {
      tempModule.orderData[i].product = tempModule.orderData[i].product.id
      tempModule.product = tempModule.orderData[i].product.id
    }
    updateOrder(tempModule,
      function success(data) {
        {
          _this.successAlert("Order status changed from " + tempStatus + " to " + status + "!");
          setTimeout(() => {
          }, 3000)
        }
      },
      function error() {
        _this.errorAlert("Error in saving order");
      }
    )


  }
  handleShowDispatchModal(order) { this.setState({ showDispatchModal: true, order: order }); }
  handleCloseDispatchModal() { this.setState({ showDispatchModal: false }); this.fetchDataFromServer() }

  render() {

    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const view = (<Tooltip id="edit_tooltip">View</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    const approved = (<Tooltip id="edit_tooltip">Approved order</Tooltip>);
    const close = (<Tooltip id="close_tooltip">Close order</Tooltip>);
    const open = (<Tooltip id="open_tooltip">Reopen order</Tooltip>);
    const dispatch = (<Tooltip id="print_tooltip">Add new dispatch schedule</Tooltip>);
    var headerCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    },
      orderDate = { Header: "Date", id: "Date", width: 100, accessor: "date", sortable: false },
      orderCode = { Header: "order number", width: 120, accessor: "number", sortable: false },
      statusCol = { Header: "Status", accessor: "status", sortable: false },
      customerCol = { Header: "Customer Name", width: 300, accessor: "customer", sortable: false },
      // siteAddressCol = {
      //   Header: "Site Address", accessor: "siteAddress", width: 300, sortable: false, Cell: (row => {
      //     return (
      //       row.original.siteAddress !== "" ?
      //         <div>
      //           {row.original.siteAddress}
      //         </div>
      //         :
      //         <div>--</div>
      //     )
      //   })
      // },
      buildingNameCol = {
        Header: "Building Name", accessor: "buildingName", width: 300, sortable: false, Cell: (row => {
          return (
            row.original.buildingName !== "" ?
              <div>
                {row.original.buildingName}
              </div>
              :
              <div>--</div>
          )
        })
      },
      poNumberCol = {
        Header: "cust PO Number", accessor: "poNumber", width: 150, sortable: false, Cell: (row => {
          return (
            row.original.poNumber !== "" ?
              <div>
                {row.original.poNumber}
              </div>
              :
              <div>--</div>
          )
        })
      },
      progressBarCol = {
        Header: "Progress", id: "progress", sortable: false, width: 200, Cell: row => {
          return (
            <div>
              <ProgressBar
                active
                bsStyle="success"
                now={row.original.progress}
                srOnly
              />
            </div>
          );
        }
      },
      totalCol = {
        Header: "Total Value (Ex. TAX)",
        id: "value", width: 200,
        accessor: (row) => {

          return (
            <div class="text-right">
              {this.state.currency} {_.round(_.sum(row.orderData.map((d) => {
                var amount = parseFloat(d.quantity * d.rate) - (d.quantity * d.rate * d.discount / 100)
                return ((amount));
              })), 0).toLocaleString("en-IN", { minimumFractionDigits: 3 })}
            </div>
          )
        }
      },
      actionCol =
      {
        Header: "", accessor: "code", width: 150,
        Cell: (row => {
          return (
            <div className="actions-right">
              {row.original.status === "Dispatching" || row.original.status === "Approved" ?
                <OverlayTrigger placement="top" overlay={dispatch}>
                  <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowDispatchModal(row.original.prop)} ><span className="fa fa-calendar-check-o"></span></Button>
                </OverlayTrigger>
                : null
              }

              {row.original.status === "New" ?
                <OverlayTrigger placement="top" overlay={edit}>
                  <Button className="btn-list" bsStyle="success" fill icon href={"#/sales/orders-edit/" + row.original.code} ><span className="fa fa-edit"></span></Button>
                </OverlayTrigger>
                :
                <OverlayTrigger placement="top" overlay={view}>
                  <Button className="btn-list" bsStyle="success" fill icon href={"#/sales/orders-edit/" + row.original.code} ><span className="fa fa-eye"></span></Button>
                </OverlayTrigger>
              }

              {row.original.status !== "Approved" ?
                row.original.status !== "Dispatching" ?
                  <OverlayTrigger placement="top" overlay={approved}>
                    <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.save(row.original, "Approved")} ><span className="fa fa fa-check"></span></Button>
                  </OverlayTrigger>
                  : null
                : null
              }
              {row.original.status !== "Closed" ?
                <OverlayTrigger placement="top" overlay={close}>
                  <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.save(row.original, "Closed")} ><span className="fa fa-times"></span></Button>
                </OverlayTrigger>
                : null
              }
              {row.original.status === "Closed" ?
                <OverlayTrigger placement="top" overlay={open}>
                  <Button className="btn-list" bsStyle="primary" fill icon onClick={() => this.save(row.original, "New")} ><span className="fa fa-refresh"></span></Button>
                </OverlayTrigger>
                : null
              }
              {cookie.load('role') === "admin" ?
                <OverlayTrigger placement="top" overlay={trash}>
                  <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash"></span></Button>
                </OverlayTrigger>
                : null
              }


            </div>
          )
        })
      }


    let table = (
      <Col xs={12}>
        {
          !this.state.moduleList || !this.state.moduleList.length
            ? (
              <Col xs={12}>No order list found.</Col>
            ) : (
              <div>
                <Row> <Col md={12}>
                  <ReactTable
                    data={this.state.moduleList}
                    columns={
                      [headerCol, orderDate, orderCode, statusCol, poNumberCol, customerCol, buildingNameCol, totalCol, progressBarCol, actionCol]
                    }
                    minRows={0}
                    sortable={false}
                    className="-striped -highlight"
                    showPaginationTop={false}
                    showPaginationBottom={this.props.view ? false : true}
                    loading={this.state.loading}
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
                </Col>
                </Row>
              </div>
            )
        }
      </Col>
    );
    let addEditDispatchScheduleModal = (
      <DispatchScheduleModalComponent
        showDispatchModal={this.state.showDispatchModal}
        handleCloseDispatchModal={this.handleCloseDispatchModal}
        order={this.state.order}
        {...this.props}
      />
    );
    let header = (
      this.props.moduleName !== "salesOrder" ?
        <div className="list-header">
          <Col xs={12} sm={4} md={2} lg={2}>
            <FormGroup>
              <Select
                clearable={false}
                placeholder="Select status"
                name="status"
                value={this.state.salesOrder.status}
                options={
                  [
                    { value: "All", label: "All" },
                    { value: "New", label: "New" },
                    { value: "Approved", label: "Approved" },
                    { value: "Dispatching", label: "Dispatching" },
                    { value: "Paid", label: "Paid" },
                    { value: "Closed", label: "Closed" },
                  ]
                }
                onChange={(selectOption) => {
                  var tempStatus = this.state.salesOrder;
                  tempStatus.status = selectOption.value;
                  this.fetchDataFromServer();
                  this.setState({ tempStatus });
                }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={2} lg={2}>
            <FormGroup>
              <FormControl
                type="text"
                name="number"
                placeholder="Search by number"
                onChange={(e) => this.filter(e, "number")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="customer"
                placeholder="Search by customer name"
                onChange={(e) => this.filter(e, "customer")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="buildingName"
                placeholder="Search by building name"
                onChange={(e) => this.filter(e, "buildingName")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={2} lg={2}>
            <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/sales/orders-edit/new")}>
              <i className="fa fa-plus" /> Add New Sales Order
						</Button>
          </Col>
          {/* <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="siteAddress"
                placeholder="Search by site address"
                onChange={(e) => this.filter(e, "siteAddress")}
              />
            </FormGroup>
          </Col> */}

        </div>
        : null
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
            {addEditDispatchScheduleModal}
            {this.props.view ? null : header}
            {table}
          </div>
        }
      </div>

    );
  }
}
export default SalesModuleListComponent;
