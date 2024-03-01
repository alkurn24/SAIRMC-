import React, { Component } from "react";
import ReactTable from "react-table";
import _ from "lodash";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import Moment from "moment";
import Select from "react-select";
import { Col, Row, ProgressBar, OverlayTrigger, Tooltip, Modal, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

import { getSocket } from "js/socket.io.js"
import PurchaseOrderInvoiceModal from "modules/purchase/orders/components/PurchaseOrderInvoiceModal.jsx";
import GrnModalComponent from "modules/purchase/grn/components/GrnModalComponent.jsx";
import { getPurchaseOrderList, deletePurchaseOrder, downloadPurchaseOrderReport, updatePurchaseOrder } from "modules/purchase/orders/server/OrderServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class PurchaseModuleListComponent extends Component {
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
      moduleListData: [],
      purchaseOrder: {
        status: "All",
      },
      module: props.module,
      filter: {
        status: "All",
        vendor: null,
        type: null
      },
      socket: getSocket()
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleShowGrnModal = this.handleShowGrnModal.bind(this);
    this.handleCloseGrnModal = this.handleCloseGrnModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);

    this.handleCloseAddInvoiceModal = this.handleCloseAddInvoiceModal.bind(this);
    this.handleShowAddInvoiceModal = this.handleShowAddInvoiceModal.bind(this);
    this.handleShowInvoice = this.handleShowInvoice.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.printReport = this.printReport.bind(this);
    this.filter = this.filter.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.save = this.save.bind(this);

  }
  handleShowAddInvoiceModal() { this.setState({ handleShowAddInvoiceModal: true }); }
  handleCloseAddInvoiceModal() { this.setState({ handleCloseAddInvoiceModal: false }); }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Purchase order", () => this.fetchDataFromServer())
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

    if (this.state.filter.vendor) { params = params + "&vendor=" + this.state.filter.vendor.trim() }
    if (this.state.filter.type) { params = params + "&type=" + this.state.filter.type.trim() }
    if (this.state.filter.status !== "All") { params = params + "&status=" + this.state.filter.status.trim() }
    if (this.props.vendorcode) params += "&vendorId=" + this.props.vendorcode
    getPurchaseOrderList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return ({
            prop: prop,
            code: prop.code ? prop.code : "",
            type: prop.type ? prop.type : "",
            number: prop.number ? prop.number : "",
            isQa: prop.isQa ? prop.isQa : "",
            billingAddr: prop.billingAddr ? prop.billingAddr.name : "",
            date: Moment(prop.createdAt).format("DD MMM YYYY"),
            status: prop.status ? prop.status : "",
            progress: prop.progress,
            vendor: (<a role="button" className="edit-link" href={"#/purchase/vendor-edit/" + prop.vendor.code}>{prop.vendor.name}</a>),
            orderData: prop.orderData
          });
        })
        _this.setState({ moduleList: tempData, pages: pages, loading: false })

      },
      function error(error) { _this.setState({ moduleList: [], loading: false }); }
    );

  }

  printReport(code) {
    downloadPurchaseOrderReport(code,
      null,
      (res) => {
        // DO NOT DELETE - method 1
        // const url = window.URL.createObjectURL(new Blob([res.data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', code + '.pdf');
        // document.body.appendChild(link);
        // link.click();

        // DO NOT DELETE - method 2
        // Create a Blob from the PDF Stream
        const file = new Blob([res.data], { type: 'application/pdf' });

        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // Open the URL on new Window
        window.open(fileURL, '_blank');
      },
      (error) => {
      }
    )
  }
  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  renderCheckbox(row) {
    return (
      <FormGroup>
        <Checkbox
          name={row.column.id + "_" + row.index}
          number={row.column.id + "_" + row.index}
          checked={row.original[row.column.id]}
          onChange={(e) => {
            let tempData = this.state.moduleList;
            tempData[row.index][row.column.id] = e.target.checked;
            this.setState({ tempData });
          }}
        />
      </FormGroup>
    )
  }
  save(row, status) {
    let _this = this;
    let tempModule = JSON.parse(JSON.stringify(row.prop));
    let tempStatus = row.status;
    tempModule.status = status;
    tempModule.isQa = row.isQa;
    delete tempModule.prop;
    tempModule.vendor = tempModule.vendor ? tempModule.vendor.id : "";
    tempModule.plant = tempModule.plant ? tempModule.plant.id : null;
    tempModule.contact = tempModule.contact ? tempModule.contact.id : null;
    tempModule.billingAddr = tempModule.billingAddr ? tempModule.billingAddr.id : null;
    tempModule.deliveryAddr = tempModule.deliveryAddr ? tempModule.deliveryAddr.id : null;
    if (tempModule.orderData.length > 0) {
      for (var i = 0; i < tempModule.orderData.length; i++) {
        tempModule.orderData[i]._id = tempModule.orderData[i]._id ? tempModule.orderData[i]._id : null;
        tempModule.orderData[i].inventoryType = tempModule.orderData[i].inventoryType ? tempModule.orderData[i].inventoryType : null;
        if (tempModule.orderData[i].purchaseRequest._id !== undefined) {
          tempModule.orderData[i].purchaseRequest = tempModule.orderData[i].purchaseRequest ? tempModule.orderData[i].purchaseRequest._id : null;
        }
        else {
          tempModule.orderData[i].purchaseRequest = tempModule.orderData[i].purchaseRequest ? tempModule.orderData[i].purchaseRequest.id : null;
        }
        tempModule.orderData[i].inventory = tempModule.orderData[i].inventory ? tempModule.orderData[i].inventory.id : null;
        tempModule.orderData[i].assetName = tempModule.orderData[i].asset ? tempModule.orderData[i].asset.name : null;
        tempModule.orderData[i].asset = tempModule.orderData[i].asset ? tempModule.orderData[i].asset.id : null;
        tempModule.orderData[i].service = tempModule.orderData[i].service ? tempModule.orderData[i].service.id : null;

      }
    }
    if (tempModule.orderData.filter(x => { return x.orderQuantity > 0 }).length > 0) {

      updatePurchaseOrder(tempModule,
        function success(data) {
          {
            status === "New" ?
              _this.successAlert("Purchase order saved successfully!")
              :
              _this.successAlert("Order status changed from " + tempStatus + " to " + status + "!")

          }
        },
        function error() {
          _this.errorAlert("Error in saving purchase order");
        }
      )
    }

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
          You will not be able to recover this order!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deletePurchaseOrder(code,
      function success() {
        _this.successAlert("Purchase order deleted successfully!")
        window.location.reload();
      },
      function error(code) {
        _this.errorAlert("Error in deleting order.");
      }
    )
  }

  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }
  handleShowGrnModal(order) { this.setState({ showGrnModal: true, order: order }); }
  handleCloseGrnModal() { this.setState({ showGrnModal: false }); this.fetchDataFromServer() }
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
    const view = (<Tooltip id="view_tooltip">View</Tooltip>);
    const print = (<Tooltip id="print_tooltip">Purchase Order</Tooltip>);
    const save = (<Tooltip id="save_tooltip">Save</Tooltip>);
    const grn = (<Tooltip id="print_tooltip">Add new GRN</Tooltip>);
    const close = (<Tooltip id="close_tooltip">Close purchase order</Tooltip>);
    const open = (<Tooltip id="open_tooltip">Reopen purchase order</Tooltip>);
    let download = (<Tooltip id="download_tooltip">Download</Tooltip>);


    var srNoCol =
    {
      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
        return (<div>{d.index + 1}</div>)
      })
    }
    var dateCol = { Header: "Date", accessor: "date", width: 120, }
    var codeCol = { Header: "po number", accessor: "number" }
    var isQaCol = { Header: "QA", accessor: "isQa", sortable: false, width: 50, Cell: this.renderCheckbox }
    var typeCol = { Header: "Request type", accessor: "type", width: 100, }
    var statusCol = { Header: "Status", accessor: "status", }
    var vendorCol = { Header: "Vendor Name", width: 300, accessor: "vendor", }
    // var billingAddrCol = {
    //   Header: "billing Address concerned person", accessor: "billingAddr", width: 300, sortable: false, Cell: (row => {
    //     return (
    //       row.original.billingAddr !== "" ?
    //         <div>
    //           {row.original.billingAddr}
    //         </div>
    //         :
    //         <div>--</div>
    //     )
    //   })
    // }
    var totalCol = {
      Header: "Total Value (Ex. TAX)",
      id: "value",
      width: 200,
      accessor: (row) => {
        return (
          <div className="text-right">
            {this.state.currency} {_.round(_.sum(row.orderData.map((d) => {
              var amount = parseFloat(d.finalAmount)
              return ((amount));
            })), 0).toLocaleString("en-IN", { minimumFractionDigits: 3 })}

          </div>
        )
      }
    }
    var progressBarCol = {
      Header: "Progress", id: "progress", width: 200, Cell: row => {
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
      },
    }
    var actionCol = {
      Header: "", accessor: "code", width: 180,
      Cell: (row => {
        return (
          <div className="actions-right">
            {row.original.type === "Service" ?
              <OverlayTrigger placement="top" overlay={download}>
                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.printReport(row.original.code)} ><span className="fa fa-download"></span></Button>
              </OverlayTrigger>
              :
              <OverlayTrigger placement="top" overlay={print}>
                <Button className="btn-list" bsStyle="info" fill icon onClick={() => this.handleShowInvoice(row.original.code)} ><span className="fa fa-print text-info"></span></Button>
              </OverlayTrigger>
            }


            {row.original.type !== "Asset" ?
              row.original.status !== "Closed" ?
                <OverlayTrigger placement="top" overlay={grn}>
                  <Button className="btn-list" bsStyle="default" fill icon onClick={() => this.handleShowGrnModal(row.original.prop)}><span className="fa fa-truck"></span></Button>
                </OverlayTrigger>
                : null
              : null
            }
            {row.original.status !== "Receiving" ?
              <OverlayTrigger placement="top" overlay={save}>
                <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.save(row.original, "New")} ><span className="fa fa-save"></span></Button>
              </OverlayTrigger>
              : null
            }
            <OverlayTrigger placement="top" overlay={view}>
              <Button className="btn-list" bsStyle="success" fill icon href={"#/purchase/orders-edit/" + row.original.code} ><span className="fa fa-eye "></span></Button>
            </OverlayTrigger>
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
                <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.code)} ><span className="fa fa-trash text-danger"></span></Button>
              </OverlayTrigger>
              : null
            }
          </div>
        )
      })
    }
    let addEditGrnModal = (
      <GrnModalComponent
        showGrnModal={this.state.showGrnModal}
        handleCloseGrnModal={this.handleCloseGrnModal}
        order={this.state.order}
        {...this.props}
      />
    );
    var invoiceModal = (
      <Modal
        dialogClassName="large-modal print"
        style={{ fontFamily: "arial" }}
        show={this.state.showInvoiceModal}>
        <Modal.Header class="header1">
          <div className="text-right">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showInvoiceModal: false })}>{null}</a>
          </div>
          <Modal.Title>Purchase Order </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PurchaseOrderInvoiceModal
            code={this.state.orderCode}
            {...this.props}
          />
        </Modal.Body>
      </Modal>
    )
    let table = (
      <Col xs={12}>
        {
          !this.state.moduleList || !this.state.moduleList.length
            ? (
              <Col xs={12}>No  purchase order list found.</Col>
            ) : (
              <div>
                <Row>
                  <Col md={12}>
                    <ReactTable
                      data={this.state.moduleList}
                      columns={
                        [srNoCol, dateCol, codeCol, typeCol, isQaCol, statusCol, vendorCol, totalCol, progressBarCol, actionCol]}

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
                </Row>
              </div>
            )
        }
      </Col>
    );

    let header = (
      <Row xs={12} className="list-header">
        <Col xs={12}>
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
                    { value: "New", label: "New" },
                    { value: "Receiving", label: "Receiving" },
                    { value: "Closed", label: "Closed" },
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
          <Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
              <FormControl
                type="text"
                name="type"
                placeholder="Search by request type"
                onChange={(e) => this.filter(e, "type")}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4} md={4} lg={4}>
          </Col>
        </Col>
      </Row>
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
            {addEditGrnModal}
            {invoiceModal}
            {this.props.view ? null : header}
            {table}
          </div>
        }
      </div>
    );
  }
}


export default PurchaseModuleListComponent;
