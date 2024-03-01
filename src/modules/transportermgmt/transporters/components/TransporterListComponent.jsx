import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, OverlayTrigger, Tooltip, FormControl, FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import { getTransporterList, deleteTransporter } from "../server/TransporterServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"
import loader from "assets/img/loader.gif";

class TransporterListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      transporterList: [],
      page: 0,
      pageSize: 25,
      pages: 0,
      loading: true,
      showTransporterModal: false,
      editObj: null,
      transporter: null,
      filter: {
        name: "",
        address: "",
        updated: false
      },
      socket: getSocket()
    };
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.delete = this.delete.bind(this);
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
        this.state.socket.on("Transporter", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()
  }
  fetchDataFromServer(state) {
    let _this = this;
    let params = "";
    params = params + "&page=" + this.state.page;
    params = params + "&pageSize=" + this.state.pageSize;
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    if (this.state.filter.address) { params = params + "&address=" + this.state.filter.address.trim() }
    getTransporterList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)

        let tempData = data.rows.map((prop, key) => {
          return {
            srNo: key + 1,
            key: key,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            name: prop.name ? prop.name : "",
            address: prop.address ? prop.address : "",
            contact: prop.contact ? prop.contact : "",
            gstin: prop.gstin ? prop.gstin : "",
            telephone: prop.telephone ? prop.telephone : "",

          };
        })
        _this.setState({ transporterList: tempData, data: tempData, pages: pages, loading: false })
      },
      function error() { _this.setState({ transporterList: [], loading: false }); }
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
          You will not be able to recover this transporter!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteTransporter(code,
      function success() {
        _this.successAlert("Transporter deleted successfully!")
      },
      function error() {
        _this.errorAlert("Error in deleting transporter.");
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

  handleShowTransporterModal(index) {
    this.setState({ showTransporterModal: true, editObj: index || index === 0 ? this.state.transporterList[index] : null })
  }
  handleCloseTransporterModal() {
    this.setState({ showTransporterModal: false, editObj: null })
    this.fetchDataFromServer()

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
          (!this.state.transporterList || !this.state.transporterList.length) ? (
            <div>No transporter found.  <a href="#/transporter/transporters-edit/new">Click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.transporterList}
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    }, { Header: "Name", accessor: "name", sortable: false },
                    { Header: "Address", accessor: "address", sortable: false },
                    { Header: "GSTIN", accessor: "gstin", sortable: false },
                    { Header: "Mobile No", accessor: "contact", sortable: false },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/transporter/transporters-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
    )

    let header = (
      <div className="list-header">
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by  name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="address"
              placeholder="Search by address"
              onChange={(e) => this.filter(e, "address")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/transporter/transporters-edit/new")}>
            <i className="fa fa-plus" /> Add New Transporter
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

export default TransporterListComponent;