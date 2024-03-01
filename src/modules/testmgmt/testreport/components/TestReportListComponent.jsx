import React, { Component } from 'react';
import ReactTable from "react-table";
import Moment from "moment";
import cookie from 'react-cookies';
import { Col, OverlayTrigger, Tooltip, } from "react-bootstrap";
import SweetAlert from 'react-bootstrap-sweetalert';

import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { getTestReportList, downloadTestReport, deleteTestReport } from "modules/testmgmt/testreport/server/TestReportServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"

class TestReportListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerList: [],
      loading: false,
      pages: 0,
      testCaseList: [],
      filteredData: [],
      socket: getSocket()
    };
    this.printReport = this.printReport.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
  }
  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        console.log(this.state.socket)
        this.state.socket.on("Test report", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }
  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer();

  }
  fetchDataFromServer(state) {
    let _this = this;
    let params = "";
    if (state !== undefined) {
      params = params + "&page=" + (state.page + 1);
      params = params + "&pageSize=" + state.pageSize;
    } getTestReportList(params,
      function success(data) {
        let pages = state && state.pageSize ? Math.ceil(data.count / state.pageSize) : 1
        let tempData = data.rows.map((prop, key) => {
          return {
            id: prop.id,
            code: prop.code,
            srNo: key + 1,
            date: Moment(prop.createdAt).format("DD MMM YYYY hh:mm A"),
            material: prop.material.name,

          };
        })
        _this.setState({ testCaseList: tempData, filteredData: tempData, pages: pages, loading: false })
      },
      function error(error) { _this.setState({ testCaseList: [], loading: false }); }
    );
  }

  printReport(code) {
    downloadTestReport(code,
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
          You will not be able to recover this test report!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteTestReport(code,
      function success() {
        _this.successAlert("Test report deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting test report.");
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

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    const report = (<Tooltip id="report_tooltip">Report</Tooltip>);

    let table = (
      <Col xs={12}>
        {
          (!this.state.testCaseList || !this.state.testCaseList.length) ? (
            <div>No test results found <a href="#/test/reports-edit/new">click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.testCaseList}
                  columns={[
                    { Header: "Sr", accessor: "srNo", width: 50, sortable: false },
                    { Header: "Date", accessor: "date" },
                    { Header: "Material", accessor: "material" },
                    {
                      Header: "", accessor: "code", width: 90,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={report}>
                              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.printReport(row.original.code)} ><span className="fa fa-download text-info"></span></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/test/reports-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
        <Col xs={12}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/test/reports-edit/new")}>
            <i className="fa fa-plus" /> Add New Test Report
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

export default TestReportListComponent;