import React, { Component } from "react";
import ReactTable from "react-table";
import _ from "lodash";
import cookie from 'react-cookies';
import Moment from "moment";
import SweetAlert from 'react-bootstrap-sweetalert';
import Datetime from "react-datetime";
import Select from "react-select";
import { Col, Row, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getOrderList, deleteOrder, updateOrder } from "modules/sales/orders/server/OrderServerComm.jsx";
import DispatchScheduleModalComponent from "modules/sales/dispatchschedule/components/DispatchScheduleModalComponent.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"

class SalesModuleListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.save = this.save.bind(this);
    this.renderNumber = this.renderNumber.bind(this);
    this.renderNumberPoDate = this.renderNumberPoDate.bind(this);
    this.renderNumberPoAmount = this.renderNumberPoAmount.bind(this);
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
    params = params + "&page=" + (this.state.page);
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.props.code) params += "&order=" + this.props.code
    if (this.props.customercode) params += "&customer=" + this.props.customercode
    params = params + "&poavailable=false";
    if (this.state.salesOrder.customer) { params = params + "&customer=" + this.state.salesOrder.customer.trim() }
    if (this.state.salesOrder.buildingName) { params = params + "&buildingName=" + this.state.salesOrder.buildingName.trim() }
    if (this.state.salesOrder.siteAddress) { params = params + "&siteAddress=" + this.state.salesOrder.siteAddress.trim() }
    if (this.state.salesOrder.number) { params = params + "&number=" + this.state.salesOrder.number.trim() }
    getOrderList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let list = data.rows.map((prop) => {
          return ({
            prop: prop,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
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
  save(row) {
    let _this = this;
    let tempModule = JSON.parse(JSON.stringify(row));
    tempModule.customer = tempModule.prop.customer.id;
    tempModule.agent = tempModule.prop.agent ? tempModule.prop.agent.id : null;
    tempModule.contact = tempModule.prop.contact ? tempModule.prop.contact.id : null;
    tempModule.salesPerson = tempModule.prop.salesPerson ? tempModule.prop.salesPerson._id : null;
    tempModule.poExpiryDate = Moment(tempModule.prop.poExpiryDate).format("DD MMM YYYY");

    tempModule.poDate = Moment(tempModule.poDate).format("DD MMM YYYY");

    if (tempModule.poNumber !== "") {
      tempModule.isPoAvailable = true;
    }
    else {
      tempModule.isPoAvailable = false;
    }
    tempModule.billingAddr = tempModule.prop.billingAddr ? tempModule.prop.billingAddr.id : null;
    tempModule.siteAddress = tempModule.prop.siteAddress ? tempModule.prop.siteAddress.id : null;
    tempModule.deliveryAddr = tempModule.prop.deliveryAddr ? tempModule.prop.deliveryAddr.id : null;
    tempModule.user = tempModule.prop.user ? tempModule.prop.user.id : null;

    for (var i = 0; i < tempModule.prop.orderData.length; i++) {
      tempModule.orderData[i].product = tempModule.prop.orderData[i].product.id
      tempModule.product = tempModule.prop.orderData[i].product.id
    }
    updateOrder(tempModule,
      function success() {
        {
          _this.successAlert("Order saved successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 3000)
        }
      },
      function error() {
        _this.errorAlert("Error in saving order");
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
  handleShowDispatchModal(order) { this.setState({ showDispatchModal: true, order: order }); }
  handleCloseDispatchModal() { this.setState({ showDispatchModal: false }); this.fetchDataFromServer() }
  renderNumber(row) {
    return (
      <FormGroup>
        <FormControl
          type="text"
          value={this.state.moduleList[row.index].poNumber}
          onChange={(e) => {
            let tempFilteredList = this.state.moduleList;
            tempFilteredList[row.index].poNumber = e.target.value;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }

  renderNumberPoAmount(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          min={0}
          name="poAmount"
          value={this.state.moduleList[row.index].poAmount ? this.state.moduleList[row.index].poAmount : 0.00}
          onChange={(e) => {
            let tempFilteredList = this.state.moduleList;
            tempFilteredList[row.index].poAmount = e.target.value;
            this.setState({ tempFilteredList })
          }}
        />
      </FormGroup>
    )
  }
  renderNumberPoDate(row) {
    return (
      <FormGroup>
        <Datetime
          timeFormat={false}
          closeOnSelect={true}
          dateFormat="DD MMM YYYY"
          name="poDate"
          value={this.state.moduleList[row.index].poDate ? Moment(this.state.moduleList[row.index].poDate).format("DD MMM YYYY") : null}
          onChange={(e) => {
            var tempOrder = this.state.moduleList;
            tempOrder[row.index].poDate = e._d;
            this.setState({ tempOrder });
          }}
        />
      </FormGroup>
    )
  }
  filter(e, name) {
    let tempFilter = this.state.salesOrder;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const save = (<Tooltip id="edit_tooltip">Save</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    const view = (<Tooltip id="edit_tooltip">View</Tooltip>);
    const dispatch = (<Tooltip id="print_tooltip">Add new dispatch</Tooltip>);

    var headerCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        return (<div>{d.index + 1}</div>)
      })
    },
      orderDate = { Header: "Date", id: "Date", width: 100, accessor: "date", sortable: false },
      orderCode = { Header: "order number", width: 140, accessor: "number", sortable: false },
      statusCol = { Header: "Status", accessor: "status", sortable: false },
      customerPOCol = { Header: "Customer PO Number", accessor: "poNumber", width: 200, Cell: this.renderNumber },
      customerPODateCol = { Header: "CUSTOMER PO date", accessor: "poDate", width: 200, Cell: this.renderNumberPoDate },
      customerPOAmountCol = { Header: "Customer PO Amount", accessor: "poAmount", width: 200, Cell: this.renderNumberPoAmount },
      customerCol = { Header: "Customer Name", width: 300, accessor: "customer", sortable: false },

      totalCol = {
        Header: "Total Value (Ex. TAX)",
        id: "value",
        accessor: (row) => {
          return (
            <div class="text-right">
              {this.state.currency} {_.round(_.sum(row.orderData.map((d) => {
                return ((d.quantity * d.rate) - (d.quantity * d.rate * d.discount / 100));
              })), 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          )
        }
      },
      actionCol =
      {
        Header: "", accessor: "code", width: 120,
        Cell: (row => {
          return (
            <div className="actions-right">
              {row.original.status === "Dispatching" || row.original.status === "Approved" ?
                <OverlayTrigger placement="top" overlay={dispatch}>
                  <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowDispatchModal(row.original.prop)} ><span className="fa fa-calendar-check-o"></span></Button>
                </OverlayTrigger>
                : null
              }
              {row.original.status !== "Dispatching" ?
                row.original.status !== "Approved" ?
                  <OverlayTrigger placement="top" overlay={edit}>
                    <Button className="btn-list" bsStyle="success" fill icon href={"#/sales/orders-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
                  </OverlayTrigger>
                  :
                  <OverlayTrigger placement="top" overlay={view}>
                    <Button className="btn-list" bsStyle="success" fill icon href={"#/sales/orders-edit/" + row.original.code} ><span className="fa fa-eye text-default"></span></Button>
                  </OverlayTrigger>
                :
                <OverlayTrigger placement="top" overlay={view}>
                  <Button className="btn-list" bsStyle="success" fill icon href={"#/sales/orders-edit/" + row.original.code} ><span className="fa fa-eye text-default"></span></Button>
                </OverlayTrigger>
              }

              <OverlayTrigger placement="top" overlay={save}>
                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.save(row.original)} ><span className="fa fa-save text-primary"></span></Button>
              </OverlayTrigger>

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


    let table = (
      <Col xs={12}>
        {
          !this.state.moduleList || !this.state.moduleList.length
            ? (
              <Col xs={12}>No order list found.</Col>
            ) : (
              <div>
                <Row>
                  {
                    <Col md={12}>
                      <ReactTable
                        data={this.state.moduleList}
                        columns={
                          [headerCol, orderDate, orderCode, statusCol, customerCol, customerPOCol, customerPODateCol, customerPOAmountCol, totalCol, actionCol]
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
                    </Col>
                  }

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
      <Col xs={12} sm={12} md={12} lg={12}>
        <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/sales/orders-edit/new")}>
          <i className="fa fa-plus" /> Add New Sales Order
						</Button>
      </Col>
    )
    return (
      <div>
        {this.state.loading ?
          <div className="loader">Loading...</div>
          :
          <div>
            {this.state.alert}
            {addEditDispatchScheduleModal}
            {header}
            {table}
          </div>
        }
      </div>
    );
  }
}
export default SalesModuleListComponent;
