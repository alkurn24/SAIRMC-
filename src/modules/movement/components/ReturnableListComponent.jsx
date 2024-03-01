import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Row, Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getMovementList, deleteMovement, downloadMovementReport } from "modules/movement/server/MovementServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class ReturnableListComponent extends Component {
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
    this.printReport = this.printReport.bind(this);
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
    let params = "view=returnable";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.movementType) { params = params + "&movementType=" + this.state.filter.movementType.trim() }
    if (this.state.filter.category) { params = params + "&category=" + this.state.filter.category.trim() }
    getMovementList(params,
      (data) => {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = []
        data.rows.map((prop, key) => {
          var temp = prop.inventoryData.filter(x => { return x.returnable === true })
          return (
            temp.map(s => {
              tempData.push({
                movementType: prop.movementType ? prop.movementType : "",
                code: prop.code ? prop.code : "",
                number: prop.number ? prop.number : "",
                status: prop.status ? prop.status : "",
                category: prop.category ? prop.category : "",
                inQty: s.inQty ? s.inQty : 0,
                outQty: s.outQty ? s.outQty : 0,
                inventoryName: s.inventory ? s.inventory.name : null,
                stock: s.stock ? s.stock : false,

              })
              return
            })
          )
        })
        _this.setState({ movementList: tempData, filteredData: tempData, pages: pages, loading: false })
      },
      () => { _this.setState({ movementList: [], filteredList: [], loading: false }); }
    )

  }
  printReport(code) {
    downloadMovementReport(code,
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
    const print = (<Tooltip id="edit_tooltip">Gate Pass</Tooltip>);

    var srNoCol = {
      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var typeCol = { Header: "Type", accessor: "movementType", sortable: false };
    var numberCol = { Header: "mov number", accessor: "number", sortable: false };
    var statusCol = { Header: "Status", accessor: "status", sortable: false };
    var categoryCol = { Header: "Category", accessor: "category", sortable: false };
    var materialCol = { Header: "Material Name", accessor: "inventoryName", sortable: false };
    var inQtyCol = {
      Header: "In Qty", accessor: "", sortable: false, Cell: (row => {
        return (
          <div className="text-right">
            {row.original.inQty ? row.original.inQty.toFixed(2) : 0.00}
          </div>
        )
      })
    };
    var outQtyCol = {
      Header: "Out Qty", accessor: "Out Qty", sortable: false, Cell: (row => {
        return (
          <div className="text-right">
            {row.original.outQty ? row.original.outQty.toFixed(2) : 0.00}
          </div>
        )
      })
    };
    var stockUpdateCol =
    {
      Header: "Sotck Update",
      accessor: "stock",
      Cell: ({ original }) => {
        return (
          original.stock
            ? <div className="text-center"><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
            :
            <div className="text-center"><span className="fa fa-times" style={{ color: "red" }}></span></div>
        )
      },
    };
    var actionsCol = {
      Header: "", accessor: "code", width: 90,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={print}>
              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.printReport(row.original.code)} ><span className="fa fa-download"></span></Button>
            </OverlayTrigger>
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
              <div>No returnable list found. <a href="#/movements/movement-edit/new">Click here</a> to create one.</div>
            ) : (
              <div>
                <Row>
                  <Col xs={12}>
                    <ReactTable
                      data={this.state.movementList}
                      columns={

                        [srNoCol, typeCol, numberCol, statusCol, categoryCol, materialCol, inQtyCol, outQtyCol, stockUpdateCol, actionsCol]
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


export default ReturnableListComponent;