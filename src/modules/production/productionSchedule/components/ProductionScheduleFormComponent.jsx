import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from "react-cookies";
import Datetime from "react-datetime";
import Moment from "moment";
import { Modal, ControlLabel, OverlayTrigger, Tooltip, Col, Row } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import Button from "components/CustomButton/CustomButton.jsx";


import { getSocket } from "js/socket.io.js"
import { updateDispatch, getDispatchSingle } from "../server/ProductionScheduleServerComm.jsx";
import { getDispatchList } from "../../../sales/dispatches/server/DispatchServerComm.jsx";
import BoMFormComponent from "modules/production/bom/components/BoMFormComponent.jsx";
import { getContactList } from "modules/common/contacts/server/ContactsServerComm.jsx";
import { getVehicleList } from "../../../transportermgmt/vehicle/server/VehicleServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class ProductionScheduleFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dispatchList: [],
      loading: false,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      productionScheduleFilters: {
        startDate: Moment().startOf("day"),
        endDate: Moment().endOf("day")
      },
      productionSchedule: {
        code: ""
      },
      showBomModal: false
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchdata = this.fetchdata.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.save = this.save.bind(this);
    this.handleShowBom = this.handleShowBom.bind(this);
    this.renderBomData = this.renderBomData.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
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
        dispatchData.supervisorName = dispatchData.supervisorName ? (dispatchData.supervisorName._id) : null;
        dispatchData.assetPumpType = dispatchData.assetPumpType ? (dispatchData.assetPumpType.id) : null;
        _this.setState({ productionSchedule: dispatchData })
        setTimeout(this.save, 10);
      },
      () => { }
    );
  }
  fetchDataFromServer() {
    let _this = this;
    let params = "";
    params = params + "&startDate=" + Moment(this.state.productionScheduleFilters.startDate).format("DD-MM-YYYY");
    params = params + "&endDate=" + Moment(this.state.productionScheduleFilters.endDate).format("DD-MM-YYYY");
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    params = params + "&status=In-Progress";
    getDispatchList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            date: Moment(prop.dispatchDate).format("DD MMM YYYY hh:mm:ss A"),
            status: prop.status,
            bomData: prop.bomData,
            code: prop.code ? prop.code : "",
            qty: prop.dispatchData[0].qty ? prop.dispatchData[0].qty : 0,
            vehicle: prop.vehicle ? prop.vehicle.vehicleNumber : "",
            driver: prop.vehicle ? prop.vehicle.driver.name : "",
            editLink: prop.code,
            number: prop.number,
            grade: prop.dispatchData[0].product.name,
            order: (
              <a role="button" className="edit-link" href={"#/sales/orders-edit/" + prop.order.code}>{prop.order ? prop.order.number : ""}</a>
            ),
            dispatchSchedule: (
              <a role="button" className="edit-link" href={"#/sales/schedule-edit/" + prop.dispatchSchedule.code}>{prop.dispatchSchedule ? prop.dispatchSchedule.number : ""}</a>
            ),
            customer: (
              <a role="button" className="edit-link" href={"#/crm/customers-edit/" + prop.order.customer.code}>{prop.order.customer ? prop.order.customer.name : ""}</a>),

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

    let tempDispatch = JSON.parse(JSON.stringify(this.state.productionSchedule)
    );
    tempDispatch.status = "Vehicle-Loaded";
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
      for (var i = 0; i < tempDispatch.bomData.length; i++) {
        tempDispatch.bomData[i].inventory = tempDispatch.bomData[i].inventory.id;
      }
    }
    for ( i = 0; i < tempDispatch.dispatchData.length; i++) {
      tempDispatch.dispatchData[i].product = tempDispatch.dispatchData[i].product.id
      if (i + 1 === tempDispatch.dispatchData.length) {
        tempDispatch.assetPumpType = tempDispatch.assetPumpType ? (tempDispatch.assetPumpType) : null
        updateDispatch(tempDispatch,
          function success() {
            _this.successAlert("Dispatch saved successfully!");
            setTimeout(() => {
              window.location.reload()
            }, 3000);
          }
        )

      }
    }

  }
  handleDateChange(name, date) {
    var productionScheduleFilters = this.state.productionScheduleFilters;
    productionScheduleFilters[name] = date._d;
    this.setState({ productionScheduleFilters });
    this.search();
  }

  clearSearchDate() {
    var productionScheduleFilters = this.state.productionScheduleFilters;
    productionScheduleFilters.startDate = Moment().startOf("month");
    productionScheduleFilters.endDate = Moment().endOf("month");

    this.setState({ productionScheduleFilters });
    this.search();
  }
  renderBomData(row) {
    var adminCondition = (cookie.load("role"));
    var srNOCol = { Header: "Material", accessor: "inventory.name" };
    var priceCol = { Header: "PRICE", accessor: "inventory.rate" };
    var qtyCol = { Header: "Qty In Stock", accessor: "stdQty", };
    var actualQtyCol = { Header: "Actual Qty", accessor: "actQty", };
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
    const add = (<Tooltip id="edit_tooltip">Dispatch</Tooltip>);

    var srNoCol =
    {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var dateCol = { Header: "Date", accessor: "date", sortable: false };
    var vehicleCol = { Header: "Vehicle No", accessor: "vehicle", sortable: false };
    var qtyCol = { Header: "Scheduling Qty", accessor: "qty", sortable: false };
    var dispatchScheduleCol = { Header: "dispatch Schedule code", width: 200, accessor: "dispatchSchedule", sortable: false }
    var driverCol = { Header: "Driver Name", accessor: "driver", sortable: false };
    var gradeCol = { Header: "grade", accessor: "grade", sortable: false };
    var codeCol = { Header: "Code", accessor: "number", sortable: false };
    var orderCol = { Header: "Order Code", accessor: "order", sortable: false };
    var customerCol = { Header: "Customer", accessor: "customer", sortable: false };
    var actionsCol = {
      Header: "", accessor: "code", width: 30,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={add}>
              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.fetchdata(row.original.code)} ><span className="fa fa-truck fa-flip-horizontal text-default"></span></Button>
            </OverlayTrigger>
          </div>
        )
      }),
    }

    let table = (
      <Col xs={12}>
        {
          !this.state.dispatchList || !this.state.dispatchList.length ? (
            <Col xs={12} sm={12} md={12} lg={12}>
              No productuon schedule found from {Moment(this.state.productionScheduleFilters.startDate).format("DD-MM-YYYY")} to {Moment(this.state.productionScheduleFilters.endDate).format("DD-MM-YYYY")}
            </Col>
          ) : (
              <Row>
                <div>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <ReactTable
                      data={this.state.dispatchList}
                      columns={[srNoCol, dateCol, codeCol, orderCol, dispatchScheduleCol, customerCol, gradeCol, qtyCol, vehicleCol, driverCol, actionsCol]}
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
                      SubComponent={this.renderBomData}
                      freezeWhenExpanded={true}
                      onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                      onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                      manual

                    />

                  </Col>
                </div>
              </Row>
            )
        }
      </Col>
    );
    let header = (
      this.props.moduleName !== "salesOrder" ?
        <div className="list-header" style={{ overflowY: "hidden" }}>
          <Col xs={12} sm={6} md={2} lg={2} style={{ marginBottom: "10px" }}>
            <ControlLabel pullRight>Start Date: </ControlLabel>
            <Datetime
              timeFormat={false}
              closeOnSelect={true}
              dateFormat="DD-MM-YYYY"
              name="startDate"
              inputProps={{ placeholder: "Start Date" }}
              value={this.state.productionScheduleFilters.startDate}
              onChange={date => this.handleDateChange("startDate", date)}
            />
          </Col>
          <Col xs={12} sm={3} md={2} lg={2} style={{ marginBottom: "10px" }}>
            <ControlLabel pullRight>End Date: </ControlLabel>
            <Datetime
              timeFormat={false}
              closeOnSelect={true}
              dateFormat="DD-MM-YYYY"
              name="endDate"
              inputProps={{ placeholder: "End date" }}
              value={this.state.productionScheduleFilters.endDate}
              onChange={date => this.handleDateChange("endDate", date)}
            />
          </Col>
        </div>
        : null
    )
    var recipeModel = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showBomModal}
        onHide={() => this.setState({ showBomModal: false })}
      >
        <Modal.Header class="header1" closeButton>
          <Modal.Title>Create New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BoMFormComponent {...this.props} />
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
            {recipeModel}
            {header}
            {table}
          </div>
        }
      </div>
    );

  }
}

export default ProductionScheduleFormComponent;
