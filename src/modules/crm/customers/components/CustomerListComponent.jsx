import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import { getCustomerList, deleteCustomer } from "modules/crm/customers/server/CustomerServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";

class CustomersListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      filter: {
        name: "",
        city: "",
        email: "",
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("Customer", () => this.fetchDataFromServer())
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
    getCustomerList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            key: key + 1,
            _id: prop._id,
            code: prop.code ? prop.code : "",
            name: prop.name ? prop.name : "",
            email: prop.email ? prop.email : "",
            city: prop.city ? prop.city : "" + "," + prop.state ? prop.state : "",
            phone: prop.phone ? prop.phone : "",
            creditLimitView: prop.creditLimit,
            paymentTerm: prop.paymentTerm ? prop.paymentTerm : "",
            ledgerBalanceView: prop.ledgerBalance,
          }
        })
        _this.setState({ data: tempData, filteredData: tempData, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ data: [], filteredData: [], loading: false }); }
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
          You will not be able to recover this customer!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteCustomer(code,
      function success() {
        _this.successAlert("Customer deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting customer.");
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
            <div>No customers found. <a href="#/crm/customers-edit/new">Click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={[
                    {
                      Header: "Sr", accessor: "key", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "Name", accessor: "name", sortable: false },
                    { Header: "City", accessor: "city", sortable: false },
                    { Header: "Email", accessor: "email", sortable: false },
                    { Header: "Phone", accessor: "phone", sortable: false },

                    {
                      Header: "Credit Limit (₹)", accessor: "ledgerView", width: 150, sortable: false, Cell: (row => {
                        var creditLimitView = parseFloat(row.original.creditLimitView)
                        return (
                          <div style={{ textAlign: "right" }}>
                            {creditLimitView.toLocaleString("en-IN", { minimumFractionDigits: 3 })}
                          </div>
                        )
                      })
                    },
                    {
                      Header: "Total Ledger Balance (₹)", width: 200, accessor: "ledgerBalanceView", sortable: false, Cell: (row => {
                        var ledgerBalanceView = parseFloat(row.original.ledgerBalanceView)
                        return (
                          <div style={{ textAlign: "right" }} className={row.original.creditLimitView >= row.original.ledgerBalanceView ? "value-success" : "value-danger"}>
                            {ledgerBalanceView.toLocaleString("en-IN", { minimumFractionDigits: 3 })}
                          </div>
                        )
                      })
                    },
                    { Header: "Payment Term (Days)", accessor: "paymentTerm", width: 120, sortable: false },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/crm/customers-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/crm/customers-edit/new")}>
            <i className="fa fa-plus" /> Add New Customer
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

export default CustomersListComponent;