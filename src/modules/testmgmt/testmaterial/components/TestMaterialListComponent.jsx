import React, { Component } from 'react';
import ReactTable from "react-table";
import SweetAlert from 'react-bootstrap-sweetalert';
import cookie from 'react-cookies';
import { Col, OverlayTrigger, Tooltip, } from "react-bootstrap";

// import UploadComponent from 'components/Upload/UploadComponent.jsx';
import Button from "components/CustomButton/CustomButton.jsx";

import { getSocket } from "js/socket.io.js"
import loader from "assets/img/loader.gif";
import { getTestMaterialList, deleteTestMaterial } from "modules/testmgmt/testmaterial/server/TestMaterialServerComm.jsx";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"

class TestMaterialListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      materialList: [],
      data: [],
      loading: false,
      page: 0,
      pageSize: 25,
      pages: 0,
      socket: getSocket()
    };
    this.routeAdd = this.routeAdd.bind(this);
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
        this.state.socket.on("Test material", () => this.fetchDataFromServer())
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
    getTestMaterialList(params,
      function success(data) {
        let pages = Math.ceil(data.count / _this.state.pageSize)
        let tempData = data.rows.map((prop, key) => {
          return {
            _id: prop._id,
            srNo: key + 1,
            key: key,
            code: prop.code ? prop.code : "",
            number: prop.number ? prop.number : "",
            photo: prop.photo ? prop.photo : "",
            name: prop.name ? prop.name : ""
          };
        })
        _this.setState({ materialList: tempData, pages: pages, loading: false })
      },
      function error() { _this.setState({ materialList: [], loading: false }); }
    );
  }

  routeAdd() {
    this.props.history.push('/test/material-edit/new');
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
          You will not be able to recover this Test material!
        </SweetAlert>
      )
    });
  }
  deleteConfirm(code) {
    let _this = this;
    deleteTestMaterial(code,
      function success() {
        _this.successAlert("Test material deleted successfully!")
      },
      function error(code) {
        _this.errorAlert("Error in deleting test material.");
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
          onConfirm={() => { this.setState({ alert: null }); this.componentWillMount() }}
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
    let table = (
      <Col xs={12}>
        {
          (!this.state.materialList || !this.state.materialList.length) ? (
            <div>No test material found. <a href="#/test/material-edit/new">Click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.materialList}
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },                    // {
                    //   Header: "Image", id: 'y', width: 200, sortable: false,
                    //   Cell: (row) => {
                    //     return <div style={{ width: "100px", height: "100px" }}>
                    //       <UploadComponent
                    //         picture
                    //         photo={row.original ? row.original.photo : defaultUserImg}
                    //       />
                    //     </div>
                    //   },
                    // },
                    { Header: "Code", accessor: "code", sortable: false },
                    { Header: "Name", accessor: "name" },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon href={"#/test/material-edit/" + row.original.code} ><span className="fa fa-edit text-primary"></span></Button>
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
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/test/material-edit/new")}>
            <i className="fa fa-plus" /> Add New Test Material
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


export default TestMaterialListComponent;