import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getVendorList, deleteVendor } from "modules/purchase/vendor/server/VendorServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";


class VendorsListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorList: [],
      data: [],
      filteredData: [],
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      alert: null,
      filter: {
        name: "",
        city: "",
        email: "",
        updated: false
      },
      socket: getSocket()

    };
    this.delete = this.delete.bind(this);
    this.filter = this.filter.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.filter = this.filter.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Vendor", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    let _this = this;
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    if (this.state.filter.city) { params = params + "&city=" + this.state.filter.city.trim() }
    if (this.state.filter.email) { params = params + "&email=" + this.state.filter.email.trim() }
    getVendorList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            key: key,
            _id: prop._id,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            name: prop.name ? prop.name : "",
            state: prop.state ? prop.state : "",
            email: prop.email ? prop.email : "",
            city: ((prop.city ? prop.city : "" + "," + prop.state ? prop.state : "")),
            phone: prop.phone ? prop.phone : "",
          };
        })
        _this.setState({ data: tempData, filteredData: tempData, pages: pages, loading: false })
      },
      function error() { _this.setState({ data: [], filteredData: [], loading: false }); }
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
          You will not be able to recover this vendor!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteVendor(code,
      function success() {
        _this.successAlert("Vendor deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting Vendor.");
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
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <Col xs={12}>
              No vendors found. <a href="#/purchase/vendor-edit/new">Click here</a> to create one.</Col>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "vendor number", accessor: "number", width: 120, },
                    { Header: "Name", accessor: "name" },
                    { Header: " State", accessor: "state" },
                    { Header: "City", accessor: "city" },
                    { Header: " Email", accessor: "email" },
                    { Header: " Phone", accessor: "phone" },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/purchase/vendor-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
                    }]}
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
              </div>
            )
        }
      </Col>
    );
    let header = (
      <div className="list-header">
        <Col xs={12} sm={4} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="city"
              placeholder="Search by city"
              onChange={(e) => this.filter(e, "city")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={4} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="email"
              placeholder="Search by email"
              onChange={(e) => this.filter(e, "email")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={3} lg={3}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/purchase/vendor-edit/new")}>
            <i className="fa fa-plus" /> Add New Vendor
						</Button>
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
            {header}
            {table}
          </div>
        }
      </div>
    );
  }
}

export default VendorsListComponent;