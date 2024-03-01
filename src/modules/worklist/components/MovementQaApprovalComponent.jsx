import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from "react-cookies";
import { FormGroup, FormControl, OverlayTrigger, Tooltip, Col, Row } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getMovementSingle, updateMovement, getMovementList, } from "modules/movement/server/MovementServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class MovementQaApprovalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventoryList: [],
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      movementList: {
        inventoryData: [],
      },
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.fetchdata = this.fetchdata.bind(this);
    this.search = this.search.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.save = this.save.bind(this);

    this.renderInventoryData = this.renderInventoryData.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.renderText = this.renderText.bind(this);

    this.renderNumberOutQty = this.renderNumberOutQty.bind(this);
    this.renderNumberInQty = this.renderNumberInQty.bind(this);
    this.fetchdataRejected = this.fetchdataRejected.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.renderCheckboxReturnable = this.renderCheckboxReturnable.bind(this);


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
    let _this = this;
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  fetchdata(code) {
    let _this = this;
    getMovementSingle(code,
      (data) => {
        let tempMovement = JSON.parse(JSON.stringify(data));
        tempMovement.owner.id = tempMovement.owner._id;
        tempMovement.status = "Approved"
        _this.setState({ movementList: tempMovement })
        setTimeout(this.save, 10);
      },
      () => { }
    )
  }
  fetchdataRejected(code) {
    let _this = this;
    getMovementSingle(code,
      (data) => {
        let tempMovement = JSON.parse(JSON.stringify(data));
        tempMovement.owner.id = tempMovement.owner._id,
          tempMovement.status = "Rejected"

        _this.setState({ movementList: tempMovement })
        setTimeout(this.save, 10);
      },
      () => { }
    )

  }
  fetchDataFromServer() {
    var _this = this;
    this.search();
  }

  search(state) {
    let _this = this;
    let params = "";
    params = params + "&page=" + (this.state.page);
    params = params + "&pageSize=" + this.state.pageSize;
    getMovementList(params,
      (data) => {
        let tempData = [];
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempList = data.rows.map((prop) => {
          return {
            code: prop.code ? prop.code : "",
            movementType: prop.movementType ? prop.movementType : "",
            user: prop.user ? prop.user.name : "",
            number: prop.number ? prop.number : "",
            category: prop.category ? prop.category : "",
            dispatch: prop.dispatch ? prop.dispatch.number : "",
            status: prop.status ? prop.status : "",
            inventoryData: prop.inventoryData

          }

        });
        _this.setState({ movementList: tempList, filteredList: tempList, pages: pages, loading: false })
      },
      () => { _this.setState({ movementList: [], filteredList: [], loading: false }); }
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

  save() {
    let _this = this;
    let message;
    let tempMovement = JSON.parse(JSON.stringify(this.state.movementList));
    tempMovement.owner = tempMovement.owner ? tempMovement.owner.id : null;
    tempMovement._movement = tempMovement._movement ? tempMovement._movement.id : null;
    tempMovement.plantFrom = tempMovement.plantFrom ? tempMovement.plantFrom.id : null;
    tempMovement.dispatch = tempMovement.dispatch ? tempMovement.dispatch.id : null;
    tempMovement.plantTo = tempMovement.plantTo ? tempMovement.plantTo.id : null;
    tempMovement.customer = tempMovement.customer ? tempMovement.customer.id : null;
    tempMovement.site = tempMovement.site ? tempMovement.site.id : null;
    if (tempMovement.inventoryData.length) {
      for (var i = 0; i < tempMovement.inventoryData.length; i++) {
        tempMovement.inventoryData[i].inventory = tempMovement.inventoryData[i].inventory.id;
      }
    }
    updateMovement(tempMovement,
      function success() {
        if (tempMovement.status === "Rejected") {
          _this.successAlert("Movement rejected successfully!");
        }
        else {
          _this.successAlert("Movement verified successfully!");
        }
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
    )

  }


  renderText(row) {
    return (
      <FormGroup>
        <FormControl
          disabled
          value={row.original ? row.original.notes : ""}
        />
      </FormGroup>
    );

  }
  renderNumberInQty(row) {
    return (
      <FormGroup>
        <FormControl
          disabled
          value={row.original ? row.original.inQty : ""}
        />
      </FormGroup>
    )
  }
  renderNumberOutQty(row) {
    return (
      <FormGroup>
        <FormControl
          disabled
          value={row.original ? row.original.outQty : ""}
        />
      </FormGroup>
    )
  }
  renderCheckbox(row) {
    return (
      <FormGroup>
        <input
          disabled
          type="checkbox"
          checked={row.original ? row.original.stock : ""}
        />
      </FormGroup>
    )
  }
  renderCheckboxReturnable(row) {
    return (
      <FormGroup>
        <input
          disabled
          type="checkbox"
          checked={row.original ? row.original.returnable : ""}
        />
      </FormGroup>
    )
  }
  renderInventoryData(row) {
    var adminCondition = (cookie.load("role"));
    var materialCol = { Header: "Material", accessor: "inventory.name", width: 200, };
    var notesCol = { Header: "Notes", accessor: "notes", Cell: this.renderText };
    var outQtyCol = { Header: "Out Qty", accessor: "outQty", width: 150, Cell: this.renderNumberOutQty };
    var inQtyCol = { Header: "In Qty", accessor: "inQty", width: 150, Cell: this.renderNumberInQty };
    var actualQtyCol = { Header: "Qty In Stock", accessor: "inventory.stock[0].standardQty", width: 150, };
    var returnableCol = { Header: "Returnable", accessor: "returnable", width: 100, Cell: this.renderCheckboxReturnable };
    var stockUpdateCol = { Header: "Stock Update", accessor: "stock", width: 100, Cell: this.renderCheckbox };
    return (
      row.original.inventoryData && row.original.inventoryData.length
        ? (
          <Col xs={12} className="react-table-subcomponent">
            <ReactTable
              data={row.original.inventoryData}
              columns={
                (adminCondition === "admin") ?
                  (
                    row.original.movementType === "Outward" ?
                      [materialCol, notesCol, outQtyCol, actualQtyCol, returnableCol, stockUpdateCol]
                      :
                      [materialCol, notesCol, inQtyCol, actualQtyCol, returnableCol, stockUpdateCol]
                  ) :
                  (
                    row.original.movementType === "Outward" ?
                      [materialCol, notesCol, outQtyCol, returnableCol, stockUpdateCol]
                      :
                      [materialCol, notesCol, inQtyCol, returnableCol, stockUpdateCol]
                  )
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
    const add = (<Tooltip id="edit_tooltip">QA approval</Tooltip>);
    const rejected = (<Tooltip id="edit_tooltip">Rejected</Tooltip>);
    var srNoCol =
    {
      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
        return (<div>{d.index + 1}</div>)
      })
    }
    var typeCol = { Header: "Type", accessor: "movementType", sortable: false }
    var numberCol = { Header: "Number", accessor: "number", sortable: false }
    var createCol = { Header: "Created By", accessor: "user", sortable: false }
    var categoryCol = { Header: "Category", accessor: "category", sortable: false }
    var statusCol = { Header: "Status", accessor: "status", sortable: false }
    var dispatchCol = { Header: "Dispatch", accessor: "dispatch", sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            {row.original.status !== "Rejected" ?
              row.original.status !== "Approved" ?
                <OverlayTrigger placement="top" overlay={add}>
                  <Button className="btn-list" bsStyle="success" fill pullRight icon onClick={() => this.fetchdata(row.original.code)}><span className="fa fa-check text-success"></span>
                  </Button>
                </OverlayTrigger>
                : null
              : null
            }
            {row.original.status !== "Rejected" ?
              row.original.status !== "Approved" ?
                <OverlayTrigger placement="top" overlay={rejected}>
                  <Button bsStyle="danger" className="btn-list" fill pullRight icon onClick={() => this.fetchdataRejected(row.original.code)}><span className="fa fa-times"></span>
                  </Button>
                </OverlayTrigger>
                : null
              : null
            }
          </div>
        )
      }),
    }

    let table = (
      <Col xs={12}>
        {
          !this.state.movementList || !this.state.movementList.length ? (
            <Col xs={12} sm={12} md={12} lg={12}>
            </Col>
          ) : (
              <Row>
                <div>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <ReactTable
                      data={this.state.movementList}
                      columns={[srNoCol, numberCol, dispatchCol, statusCol, typeCol, createCol, categoryCol, actionsCol]}
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

    );

  }
}

export default MovementQaApprovalComponent;
