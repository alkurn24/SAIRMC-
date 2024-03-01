import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";
import { Col, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import PurchaseOrderModalComponent from "../../orders/components/PurchaseOrderModalComponent"
import { getPurchaseRequestList, deletePurchaseRequest } from "modules/purchase/purchaseRequest/server/PurchaseRequestServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class PurchaseRequestListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      moduleName: props.moduleName,
      currency: "₹ ",
      moduleList: [],
      module: props.module,
      filter: {
        plant: null,
        type: null,
      },
      socket: getSocket()
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleShowPurchaseOrderModal = this.handleShowPurchaseOrderModal.bind(this);
    this.handleClosePurchaseOrderModal = this.handleClosePurchaseOrderModal.bind(this);

    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);

    this.handleCloseAddInvoiceModal = this.handleCloseAddInvoiceModal.bind(this);
    this.handleShowAddInvoiceModal = this.handleShowAddInvoiceModal.bind(this);
    this.handleShowInvoice = this.handleShowInvoice.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);

  }
  handleShowAddInvoiceModal() { this.setState({ handleShowAddInvoiceModal: true }); }
  handleCloseAddInvoiceModal() { this.setState({ handleCloseAddInvoiceModal: false }); }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Purchase request", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillReceiveProps(newProps) {
    this.props = newProps
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    let _this = this;
    let params = "status=New";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.plant) { params = params + "&plant=" + this.state.filter.plant.trim() }
    if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
    getPurchaseRequestList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return ({
            prop: prop,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            status: prop.status ? prop.status : "",
            type: prop.type ? prop.type : "",
            plant: prop.plant ? prop.plant.name : null,
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            orderData: prop.orderData
          });
        })
        _this.setState({ moduleList: tempData, pages: pages, loading: false })

      },
      function error(error) { _this.setState({ moduleList: [], loading: false }); }
    );

  }
  handleShowInvoice(code) {
    this.setState({ showInvoiceModal: true, orderCode: code })
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
          You will not be able to recover this purchase request!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deletePurchaseRequest(code,
      function success() {
        _this.successAlert("purchase request deleted successfully!")
        window.location.reload();
      },
      function error(code) {
        _this.errorAlert("Error in deleting purchase request.");
      }
    )
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }
  handleShowPurchaseOrderModal(purchaseRequest) { this.setState({ showPurchaseOrderModal: true, purchaseRequest: purchaseRequest }); }
  handleClosePurchaseOrderModal() { this.setState({ showPurchaseOrderModal: false }); this.fetchDataFromServer() }
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
    const edit = (<Tooltip id="edit_tooltip">View</Tooltip>);

    let addEditPurchaseModal = (
      <PurchaseOrderModalComponent
        showPurchaseOrderModal={this.state.showPurchaseOrderModal}
        handleClosePurchaseOrderModal={this.handleClosePurchaseOrderModal}
        purchaseRequest={this.state.purchaseRequest}
        {...this.props}
      />
    );
    let table = (
      <Col xs={12}>
        {
          !this.state.moduleList || !this.state.moduleList.length
            ? (
              <Col xs={12}>

                No purchase request found.
              </Col>
            )
            : (
              <div>
                <ReactTable
                  data={this.state.moduleList}
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "pr number", accessor: "number", width: 120 },
                    { Header: "Date", accessor: "date", width: 120 },
                    { Header: "Request type", accessor: "type", width: 120 },
                    { Header: "Status", accessor: "status", width: 120 },
                    { Header: "Location", accessor: "plant" },

                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/purchase/purchaserequest-edit/" + row.original.code} ><span className="fa fa-eye text-primary"></span></Button>
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
                  ]}
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
      this.props.moduleName !== "purchaseOrder" ?

        <div className="list-header">
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="city"
                placeholder="Search by request type"
                onChange={(e) => this.filter(e, "type")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="name"
                placeholder="Search by location"
                onChange={(e) => this.filter(e, "plant")}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={6} md={6} lg={6}>
            <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/purchase/purchaserequest-edit/new")}>
              <i className="fa fa-plus" /> Create New Purchase Request
						</Button>
            {
              this.state.moduleList.length >= 1 ?
                <Button pullRight bsStyle="primary" fill onClick={() => this.handleShowPurchaseOrderModal()}>
                  <i className="fa fa-shopping-cart " /> Create New Purchase Order
						</Button>
                : null
            }
          </Col>
        </div >
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
            {addEditPurchaseModal}
            {header}
            {table}
          </div>
        }
      </div>
    );
  }
}


export default PurchaseRequestListComponent;
