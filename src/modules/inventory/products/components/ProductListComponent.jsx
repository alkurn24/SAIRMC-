import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, Row, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getPlantList } from "modules/settings/plants/server/PlantServerComm.jsx";
import { getProductList, deleteProduct } from "../server/ProductServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class ProductListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      data: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket(),
      loading: true,
      filter: {
        name: "",
        hsn: null,
      },
      plantList: [],

    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.delete = this.delete.bind(this);
    this.filter = this.filter.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Product", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }


  componentWillMount() {
    this.getSocketConnection();
    this.fetchData();
    this.fetchDataFromServer();
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
          You will not be able to recover this product!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteProduct(code,
      function success() {
        _this.successAlert("Product deleted successfully!")
      },
      function error() {
        _this.errorAlert("Error in deleting product.");
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
          onConfirm={() => { this.setState({ alert: null }); this.fetchDataFromServer(); }}
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
  fetchData() {
    let _this = this;
    getPlantList(null,
      function success(data) {
        _this.setState({
          plantList: data.rows.map((s) => {
            return {
              _id: s.id,
              value: s.id,
              label: s.plant,
            }
          })
        });
      })
  }
  fetchDataFromServer(state) {
    let params = "";
    let _this = this;
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    // if (this.state.filter.hsn) { params = params + "&hsn=" + this.state.filter.hsn.trim() }
    getProductList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempList = data.rows.map((prop) => {
          return {
            hsn: prop.hsn.hsn ? prop.hsn.hsn : "",
            code: prop.code ? prop.code : "",
            id: prop.id ? prop.id : "",
            name: prop.name ? prop.name : "",
            unit: prop.unit ? prop.unit : ""
          }
        })
        _this.setState({ productList: tempList, data: tempList, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ productList: [], loading: false }); }
    );
  }
  handleDropDownChange(selectOption, type) {
    var newFilter = this.state.filter;
    newFilter[type] = selectOption ? selectOption.value : null;
    this.setState({ filter: newFilter });
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
    var srNoCol = {
      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
        let base = ((this.state.page) * this.state.pageSize)
        return (<div>{base + d.index + 1}</div>)
      })
    }
    var productlNameCol = { Header: " Name", accessor: "name", sortable: false }
    var hsnCol = { Header: "HSN Code", accessor: "hsn", sortable: false }
    var unitCol = { Header: "Unit", accessor: "unit", sortable: false }
    var actionsCol = {
      Header: "", accessor: "code", width: 60,
      Cell: (row => {
        return (
          <div className="actions-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button className="btn-list" bsStyle="success" fill icon href={"#inventory/product-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
        <Row>
          {
            !this.state.productList || !this.state.productList.length
              ? (
                <Col xs={12}>
                  No products found. <a href="#/inventory/product-edit/new">Click here</a> to create one.</Col>
              ) : (
                <div>

                  <Col xs={12}>
                    <ReactTable
                      data={this.state.productList}
                      columns={[srNoCol, productlNameCol, hsnCol, unitCol, actionsCol]}
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
              )
          }
        </Row>
      </Col>
    );
    let header = (
      <div className="list-header">
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by product name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        {/* <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="hsn"
              placeholder="Search by HSN code"
              onChange={(e) => this.filter(e, "hsn")}
            />
          </FormGroup>
        </Col> */}
        <Col xs={12} sm={12} md={6} lg={6}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/inventory/product-edit/new")}>
            <i className="fa fa-plus" /> Add New Product
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


export default ProductListComponent;