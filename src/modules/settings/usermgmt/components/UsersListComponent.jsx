import React, { Component } from "react";
import ReactTable from "react-table";
import { Modal, Col, FormGroup, FormControl, OverlayTrigger, Tooltip, } from "react-bootstrap";

import cookie from 'react-cookies';
import SweetAlert from "react-bootstrap-sweetalert";

import Button from "components/CustomButton/CustomButton.jsx";
import loader from "assets/img/loader.gif";

import UserFormComponent from "modules/settings/usermgmt/components/UserFormComponent.jsx";

import avatar from "assets/img/default-avatar.png";
import { getUserList, deleteUser } from "../server/UserServerComm.jsx";
import { getSocket } from "js/socket.io.js"
import { backendURL } from 'variables/appVariables.jsx';
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class UsersListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      page: 0,
      pageSize: 10,
      pages: 0,
      loading: false,
      filter: {
        name: "",
        email: "",
        member: null,
        institute: null,
        updated: false
      }
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.filter = this.filter.bind(this);
    this.handleShowUserModal = this.handleShowUserModal.bind(this);
    this.handleCloseUserModal = this.handleCloseUserModal.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.successAlert = this.successAlert.bind(this);
    this.errorAlert = this.errorAlert.bind(this);
    this.getSocketConnection = this.getSocketConnection.bind(this);
    this.renderPicture = this.renderPicture.bind(this);
  }

  getSocketConnection() {
    if (getSocket()) {
      this.setState({ socket: getSocket() })
      setTimeout(() => {
        this.state.socket.on("List updated", () => this.fetchDataFromServer())
      }, 100)
    } else setTimeout(this.getSocketConnection, 2000)
  }

  componentWillMount() {
    this.getSocketConnection();
    this.fetchDataFromServer()
  }

  onChangePage(pageOfItems) {
    this.setState({ dataPaginated: pageOfItems });
  }

  fetchDataFromServer() {
    let _this = this;
    let params = "";
    if (this.state.filter.name) { params = params + "&name=" + this.state.filter.name.trim() }
    if (this.state.filter.email) { params = params + "&email=" + this.state.filter.email.trim() }
    getUserList(params,
      function success(data) {
        var tempData = data.rows.map((prop, key) => {
          return {
            _id: prop._id,
            srNo: key + 1,
            key: key,
            code: prop.code,
            id: prop.id,
            name: prop.name,
            photo: prop.photo,
            username: prop.username,
            phone: prop.phone,
            email: prop.email,
            role: prop.role,
            supervisorName: prop.supervisorName ? prop.supervisorName._id : null,
            supervisor: prop.supervisorName ? prop.supervisorName.name : null,
          };
        })
        _this.setState({ data: tempData, filteredData: tempData, loading: false })
      },
      function error(error) { _this.setState({ data: [], filteredData: [], loading: false }); }
    );
  }

  delete(id) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteConfirm(id)}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="info"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this user!
        </SweetAlert>
      )
    });
  }

  deleteConfirm(id) {
    let _this = this;
    deleteUser(id,
      function success() {
        _this.successAlert("User deleted successfully!")
      },
      function error(id) {
        _this.errorAlert("Error in deleting user.");
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

  handleShowUserModal(index) {
    this.setState({ showUserModal: true, editObj: index || index === 0 ? this.state.data[index] : null })
  }

  handleCloseUserModal() {
    this.setState({ showUserModal: false, editObj: null })
    this.fetchDataFromServer();
  }


  filter(e, name) {
    let tempFilter = this.state.filter;
    tempFilter[name] = e.target.value;
    this.setState({ tempFilter, page: 0 });
    setTimeout(() => this.fetchDataFromServer(), 100);
  }
  renderPicture(row) {
    return (
      <div className="photo">
        {row.original.photo ?
          <img src={backendURL + row.original.photo} alt="" style={{ height: "25px", width: "25px", borderRadius: "25px" }} />
          :
          <img src={avatar} alt="Avatar" style={{ height: "25px", width: "25px", borderRadius: "25px" }} />
        }
      </div>
    )
  }

  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.filteredData || !this.state.filteredData.length) ? (
            <div>No users found <a role="button" onClick={() => this.setState({ showUserModal: true })}>click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  data={this.state.filteredData}
                  columns={[
                    { Header: "SR", accessor: "srNo", width: 50, sortable: false, Cell: (row => { return (<div>{row.index + 1}</div>) }) },
                    { Header: "Photo", accessor: "photo", sortable: false, Cell: this.renderPicture, width: 60, },
                    // { Header: " Employee ID", accessor: "username", width: 120, sortable: false },
                    { Header: "Name", accessor: "name" },
                    { Header: "Email", accessor: "email", },
                    { Header: "Supervisor Name", accessor: "supervisor" },
                    { Header: "Role", accessor: "role", width: 100, },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <Button className="btn-list" bsStyle="success" fill icon onClick={() => this.handleShowUserModal(row.original.key)}><span className="fa fa-edit text-primary"></span></Button>
                            </OverlayTrigger>
                            {cookie.load('role') === "admin" ?
                              cookie.load('email') !== row.original.email ?
                                < OverlayTrigger placement="top" overlay={trash}>
                                  <Button className="btn-list" bsStyle="danger" fill icon onClick={() => this.delete(row.original.id)} ><span className="fa fa-trash text-danger"></span></Button>
                                </OverlayTrigger>
                                : null
                              : null
                            }
                          </div>
                        )
                      }),
                    }
                  ]}
                  minRows={0}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  sortable={false}
                />
              </div>
            )
        }
      </Col>
    );
    let header = (
      <div className="list-header">
        <Col xs={12} sm={6} md={4} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="name"
              placeholder="Search by name"
              onChange={(e) => this.filter(e, "name")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <FormGroup>
            <FormControl
              type="text"
              name="email"
              placeholder="Search by email"
              onChange={(e) => this.filter(e, "email")}
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} md={4} lg={6}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.setState({ showUserModal: true })}>
            <i className="fa fa-plus" /> Add New User
						</Button>
        </Col>
      </div>
    );
    let userModal = (
      <Modal
        className="default-modal"
        show={this.state.showUserModal}>
        <Modal.Header>
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.setState({ showUserModal: false, editObj: null })}>{null}</a>
          </div>
          <Modal.Title>Add/Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserFormComponent
            handleCloseModal={this.handleCloseUserModal}
            settings={false}
            user={this.state.editObj}
            {...this.props}>
          </UserFormComponent>
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
            {userModal}
            {header}
            {table}
          </div>
        }
      </div>
    )

  }
}

export default UsersListComponent;