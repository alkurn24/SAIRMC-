import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from "react-cookies";
import { FormGroup, FormControl, OverlayTrigger, Tooltip, Col, Row } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import Button from "components/CustomButton/CustomButton.jsx";
import Moment from "moment";


import { getSocket } from "js/socket.io.js"
import { getDispatchList, updateDispatch, getDispatchSingle } from "../../sales/dispatches/server/DispatchServerComm.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";
import { getVehicleList } from "../../transportermgmt/vehicle/server/VehicleServerComm";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class DispatchQaApprovalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispatchList: [],
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      dispatchApproval: {
        code: ""
      },
      showBomModal: false
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchdata = this.fetchdata.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.save = this.save.bind(this);
    this.renderBomData = this.renderBomData.bind(this);
    this.renderBomDataStdQty = this.renderBomDataStdQty.bind(this);
    this.renderBomDataActualQty = this.renderBomDataActualQty.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.fetchdataRejected = this.fetchdataRejected.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Dispatch", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  fetchdata(code) {
    let _this = this;
    let params;
    let dispatchData;
    getDispatchSingle(code,
      data => {
        getContactList("type=Shipping&customer=" + data.order.customer.id,
          function success(data) {
            _this.setState({
              phoneList: data.rows.map(prop => {
                return {
                  id: prop.id,
                  value: prop.id,
                  label: prop.phone,
                }
              })
            })
          },
        )
        if (data.transporter === null) { params = null; }
        else {
          params = "transporter=" + data.transporter ? data.transporter.id : "";
        }
        getVehicleList(params,
          (data => {
            _this.setState({
              vehicleList: data.rows.map(prop => {
                return ({
                  id: prop.id,
                  value: prop.id,
                  label: prop.vehicleNumber,
                  driver: prop.driver.name,
                  driverId: prop.driver._id
                })
              })
            })
          }),
          (() => { })
        )
        dispatchData = JSON.parse(JSON.stringify(data));
        dispatchData.dispatchDate = Moment(dispatchData.dispatchDate);
        dispatchData.status = "BOM-Verified";
        dispatchData.supervisorName = dispatchData.supervisorName ? (dispatchData.supervisorName._id) : null;
        dispatchData.assetPumpType = dispatchData.assetPumpType ? (dispatchData.assetPumpType.id) : null;
        _this.setState({ dispatchApproval: dispatchData })
        setTimeout(this.save, 10);
      },
      () => { }
    );
  }
  fetchdataRejected(code) {
    let _this = this;
    let params;
    let dispatchData;
    getDispatchSingle(code,
      data => {
        getContactList("type=Shipping&customer=" + data.order.customer.id,
          function success(data) {
            _this.setState({
              phoneList: data.rows.map(prop => {
                return {
                  id: prop.id,
                  value: prop.id,
                  label: prop.phone,
                }
              })
            })
          },
        )
        if (data.transporter === null) { params = null; }
        else {
          params = "transporter=" + data.transporter ? data.transporter.id : "";
        }
        getVehicleList(params,
          (data => {
            _this.setState({
              vehicleList: data.rows.map(prop => {
                return ({
                  id: prop.id,
                  value: prop.id,
                  label: prop.vehicleNumber,
                  driver: prop.driver.name,
                  driverId: prop.driver._id
                })
              })
            })
          }),
          (() => { })
        )
        dispatchData = JSON.parse(JSON.stringify(data));
        dispatchData.dispatchDate = Moment(dispatchData.dispatchDate);
        dispatchData.status = "Rejected";
        dispatchData.supervisorName = dispatchData.supervisorName ? (dispatchData.supervisorName._id) : null;
        dispatchData.assetPumpType = dispatchData.assetPumpType ? (dispatchData.assetPumpType.id) : null;
        _this.setState({ dispatchApproval: dispatchData })
        setTimeout(this.save, 10);
      },
      () => { }
    );

  }
  fetchDataFromServer() {
    let _this = this;
    let params = "";
    params = params + "&status=Planned";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    getDispatchList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            date: Moment(prop.dispatchDate).format("DD MMM YYYY"),
            status: prop.status,
            bomData: prop.bomData,
            code: prop.code ? prop.code : "",
            qty: prop.dispatchData[0].qty ? prop.dispatchData[0].qty : 0,
            editLink: prop.code,
            number: prop.number,
            order: (
              <a role="button" className="edit-link" href={"#/sales/orders-edit/" + prop.order.code}>{prop.order ? prop.order.number : ""}</a>
            ),
            dispatchSchedule: prop.dispatchSchedule ? prop.dispatchSchedule.number : "",
            customer: (
              <a role="button" className="edit-link" href={"#/crm/customers-edit/" + prop.order.customer.code}>{prop.order.customer ? prop.order.customer.name : ""}</a>),

            grade: (
              <a role="button" className="edit-link" > {prop.dispatchData[0].product.name} </a>
            ),

          };
        })
        _this.setState({ dispatchList: tempData, pages: pages, loading: false })

      },
      function error() { _this.setState({ dispatchList: [], loading: false }); }

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
        />
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
        />
      )
    });
  }

  handleShowBom(code) {
    this.setState({ showBomModal: true, bomcode: code });
  }
  save() {
    let _this = this;
    let i = 0;
    let tempDispatch = JSON.parse(JSON.stringify(this.state.dispatchApproval));
    for (i = 0; i < _this.state.dispatchList.length; i++) {
      tempDispatch.bomData = _this.state.dispatchList[i].bomData
    }
    tempDispatch.dispatchDate = Moment().format("DD MMM YYYY hh:mm A");
    tempDispatch.order = tempDispatch.order.id;
    tempDispatch.transporter = tempDispatch.transporter ? tempDispatch.transporter.id : null;
    tempDispatch.driver = tempDispatch.vehicle ? tempDispatch.vehicle.driver._id : null;
    tempDispatch.vehicle = tempDispatch.vehicle ? tempDispatch.vehicle.id : null;
    tempDispatch.phone = tempDispatch.phone ? tempDispatch.phone.id : null;
    tempDispatch.dispatchingPlant = tempDispatch.dispatchingPlant ? tempDispatch.dispatchingPlant.id : null;
    tempDispatch.deliveryAddr = tempDispatch.deliveryAddr ? tempDispatch.deliveryAddr.id : null;
    tempDispatch.dispatchSchedule = tempDispatch.dispatchSchedule ? tempDispatch.dispatchSchedule.id : null;

    if (tempDispatch.bomData.length) {
      for (i = 0; i < tempDispatch.bomData.length; i++) {
        tempDispatch.bomData[i].inventory = tempDispatch.bomData[i].inventory.id ? tempDispatch.bomData[i].inventory.id : tempDispatch.bomData[i].inventory;
      }
    }
    for (i = 0; i < tempDispatch.dispatchData.length; i++) {
      tempDispatch.dispatchData[i].product = tempDispatch.dispatchData[i].product.id
      if (i + 1 === tempDispatch.dispatchData.length) {
        tempDispatch.assetPumpType = tempDispatch.assetPumpType ? (tempDispatch.assetPumpType) : null
        updateDispatch(tempDispatch,
          function success() {
            if (tempDispatch.status === "Rejected") {
              _this.successAlert("BOM rejected successfully!");
              _this.props.history.push("/sales/dispatch");
            }
            else {
              _this.successAlert("BOM verified successfully!");
              _this.props.history.push("/sales/dispatch");
            }

          }
        )
      }
    }

  }

  renderBomDataActualQty(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          min={0}
          value={this.state.dispatchList[0].bomData[row.index] ? this.state.dispatchList[0].bomData[row.index].actQty : 0}
          onChange={(e) => {
            var tempDispatch = this.state.dispatchList;
            tempDispatch[0].bomData[row.index].actQty = e.target.value;
            this.setState({ tempDispatch });
          }}
        />
      </FormGroup>
    )
  }

  renderBomDataStdQty(row) {
    return (
      <FormGroup>
        <FormControl
          type="number"
          min={0}
          value={this.state.dispatchList[0].bomData[row.index] ? this.state.dispatchList[0].bomData[row.index].stdQty : 0}
          onChange={(e) => {
            var tempDispatch = this.state.dispatchList;
            tempDispatch[0].bomData[row.index].stdQty = e.target.value;
            this.setState({ tempDispatch });
          }}
        />
      </FormGroup>
    )
  }
  renderBomData(row) {
    var adminCondition = (cookie.load("role"));
    var srNOCol = { Header: "Material", accessor: "inventory.name" };
    var priceCol = { Header: "PRICE", accessor: "inventory.rate" };
    var qtyCol = { Header: "Qty In Stock", accessor: "stdQty", Cell: this.renderBomDataStdQty };
    var actualQtyCol = { Header: "Actual Qty", accessor: "actQty", Cell: this.renderBomDataActualQty };
    return (
      row.original.bomData && row.original.bomData.length
        ? (
          <Col xs={12} className="react-table-subcomponent">
            <ReactTable
              data={row.original.bomData}
              columns={
                (adminCondition === "admin") ?
                  [srNOCol, priceCol, qtyCol, actualQtyCol]
                  :
                  [srNOCol, priceCol, qtyCol]

              }
              minRows={0}
              sortable={false}
              className="-striped -highlight"
              showPaginationTop={false}
              showPaginationBottom={false}

            />
          </Col>
        ) : null
    )
  }
  render() {
    const add = (<Tooltip id="edit_tooltip"> Save & QA approval</Tooltip>);
    const rejected = (<Tooltip id="edit_tooltip">Rejected</Tooltip>);
    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var dateCol = { Header: "Date", accessor: "date", sortable: false };
    var qtyCol = { Header: "Scheduling Qty", accessor: "qty", sortable: false };
    var dispatchScheduleCol = { Header: "dispatch Schedule code", width: 200, accessor: "dispatchSchedule", sortable: false }

    var gradeCol = { Header: "Product Name", accessor: "grade", sortable: false };
    var codeCol = { Header: "Code", accessor: "number", sortable: false };
    var orderCol = { Header: "Order Code", accessor: "order", sortable: false };
    var customerCol = { Header: "Customer", accessor: "customer", sortable: false };
    var actionsCol = {
      Header: "", accessor: "code", width: 70,
      Cell: (row => {
        return (
          <div className="actions-right">
            {row.original.status !== "BOM Verified" ?
              <OverlayTrigger placement="top" overlay={add}>
                <Button className="btn-list" bsStyle="success" fill pullRight icon onClick={() => this.fetchdata(row.original.code)}><span className="fa fa-check text-success"></span>
                </Button>
              </OverlayTrigger>
              : null
            }
            {row.original.status !== "Rejected" ?
              <OverlayTrigger placement="top" overlay={rejected}>
                <Button bsStyle="danger" className="btn-list" fill pullRight icon onClick={() => this.fetchdataRejected(row.original.code)}><span className="fa fa-times"></span>
                </Button>
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
          !this.state.dispatchList || !this.state.dispatchList.length ? (
            <Col xs={12} sm={12} md={12} lg={12}>
            </Col>
          ) : (
              <Row>
                <div>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <ReactTable
                      data={this.state.dispatchList}
                      columns={[srNoCol, dateCol, codeCol, orderCol, dispatchScheduleCol, customerCol, gradeCol, qtyCol, actionsCol]}
                      minRows={0}
                      sortable={false}
                      className="-striped -highlight"
                      showPaginationTop={false}
                      showPaginationBottom={true}
                      loading={this.state.loading}
                      pageSize={this.state.pageSize}
                      pages={this.state.pages}
                      defaultPageSize={defaultPageSize}
                      pageSizeOptions={pageSizeOptionsList}
                      manual
                      onFetchData={this.fetchDataFromServer}
                      SubComponent={this.renderBomData}
                      freezeWhenExpanded={true}
                      onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                      onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                    />

                  </Col>
                </div>
              </Row>
            )
        }
      </Col>
    );

    return (
      <div>
        {this.state.loading ?
          <div className="modal-backdrop in">
            <img src={loader} alt="loader" className="preLoader" />
          </div>
          :
          < div>
            {this.state.alert}
            {table}
          </div>
        }
      </div>
    )

  }
}

export default DispatchQaApprovalComponent;
