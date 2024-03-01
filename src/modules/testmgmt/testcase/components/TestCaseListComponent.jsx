import React, { Component } from 'react';
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

import { getTestCaseList, deleteTestCase } from "modules/testmgmt/testcase/server/TestCaseServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class TestCaseListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      page: 0,
      pageSize: 25,
      pages: 0,
      filter: {
        name: null,
      },
      testCaseList: [],
      data: [],
      pages: null,
      socket: getSocket()
    };
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.filter = this.filter.bind(this);

  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Test case", () => this.fetchDataFromServer())
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
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name }
    getTestCaseList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            id: prop.id ? prop.id : "",
            srNo: key + 1,
            key: key,
            code: prop.code ? prop.code : "",
            name: prop.name ? prop.name : "",
            accredation: prop.accredation ? prop.accredation : "",
            procedureId: prop.procedureId ? prop.procedureId : "",
            timeToTest: prop.timeToTest ? prop.timeToTest : "",
            pdcTime: prop.pdcTime ? prop.pdcTime : "",
            createdBy: prop.user ? prop.user.name : "",
          };
        })
        _this.setState({ testCaseList: tempData, pages: pages, loading: false })

      },
      function error(error) { _this.setState({ testCaseList: [], loading: false }); }
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
          You will not be able to recover this test case!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteTestCase(code,
      function success() {
        _this.successAlert("Test case deleted successfully!")
      },
      function error() {
        _this.errorAlert("Error in deleting test case.");
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
          (!this.state.testCaseList || !this.state.testCaseList.length) ? (
            <div>No test cases found. <a href="#/test/cases-edit/new">Click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.testCaseList}
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "Name", accessor: "name", width: 300 },
                    {
                      Header: "NABL",
                      accessor: "accredation",
                      width: 75,
                      Cell: ({ original }) => {
                        return (
                          original.accredation
                            ? <div><span className="fa fa-check" style={{ color: "darkgreen" }}></span></div>
                            : <div><span className="fa fa-times" style={{ color: "red" }}></span></div>
                        )
                      },
                    },
                    { Header: "Procedure Id", accessor: "procedureId", },
                    // { Header: "Time To Test (mins)", accessor: "timeToTest", },
                    // { Header: "PDC Time (Days)", accessor: "pdcTime", },
                    { Header: "Created By", accessor: "createdBy", },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/test/cases-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
        <Col xs={12} sm={6} md={3} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={9} lg={9}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/test/cases-edit/new")}>
            <i className="fa fa-plus" /> Add New Test Case
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


export default TestCaseListComponent;