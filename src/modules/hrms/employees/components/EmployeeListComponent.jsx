import React, { Component } from "react";
import ReactTable from "react-table";
import cookie from 'react-cookies';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Col, FormGroup, FormControl, OverlayTrigger, Tooltip, ControlLabel } from "react-bootstrap";
import _ from "lodash";

import Button from "components/CustomButton/CustomButton.jsx";

import { getEmployeeList, deleteEmployee } from "../server/EmployeeServerComm";
import Moment from "moment";
import { backendURL } from 'variables/appVariables.jsx';
import avatar from "assets/img/default-avatar.png";
import { pageSizeOptionsList, defaultPageSize } from "variables/appVariables.jsx"


class EmployeeListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 0,
      pageSize: 25,
      searchByEmployee: "",
      pages: 0,
      loading: false,
      employeeList: [],
      isAlart: false,
      alart: { message: "" },
    };
    this.renderPicture = this.renderPicture.bind(this);

  }

  componentWillMount() {
    this.fetchDataFromServer();
  }
  handleSearchByEmployee = e => {
    const searchByEmployee = e.target.value;
    const params = `limit=${this.state.pageSize}&page=${this.state.page}&val=${searchByEmployee}`
    getEmployeeList(params, (data) => {
      console.log(data);
      let pages = Math.ceil(data.count / this.state.pageSize);
      let employeeList = data.rows.map((prop, key) => {
        return {
          key: key,
          _id: prop.id,
          code: prop.code ? prop.code : "",
          empId: prop.empId ? prop.empId : "",
          number: prop.number ? prop.number : "",
          name: prop.name ? prop.name : "",
          state: prop.state ? prop.state : "",
          supervisor: prop.supervisor ? prop.supervisor.name : "",
          email: prop.email ? prop.email : "",
          city: ((prop.city ? prop.city : "" + "," + prop.state ? prop.state : "")),
          phone: prop.phone ? prop.phone : "",
          designation: prop.designation ? prop.designation.name : "",
          gender: prop.gender ? prop.gender : "",
          brithDate: prop.birthDate ? Moment(prop.birthDate).format("DD MMM YYYY") : "",
          bankDetails: prop.bankDetails ? prop.bankDetails : ""
        };
      })
      this.setState({ employeeList, pages })
    }, this.error);
    this.setState({ searchByEmployee })
  }
  fetchDataFromServer = () => {
    const params = `limit=${this.state.pageSize}&page=${this.state.page}&val=${this.state.searchByEmployee}`
    getEmployeeList(params, (data) => {
      let pages = Math.ceil(data.count / this.state.pageSize)
      let employeeList = data.rows.map((prop, key) => {
        return {
          key: key,
          _id: prop.id,
          code: prop.code ? prop.code : "",
          empId: prop.empId ? prop.empId : "",
          number: prop.number ? prop.number : "",
          name: prop.name ? prop.title + prop.name : "",
          state: prop.state ? prop.state : "",
          photo: prop.photo ? prop.photo : "",
          _parent: prop._parent ? prop._parent.name : "",
          email: prop.email ? prop.email : "",
          city: ((prop.city ? prop.city : "" + "," + prop.state ? prop.state : "")),
          phone: prop.phone ? prop.phone : "",
          designation: prop.designation ? prop.designation.name : "",
          gender: prop.gender ? prop.gender : "",
          brithDate: prop.birthDate ? Moment(prop.birthDate).format("DD MMM YYYY") : "",
          bankDetails: prop.bankDetails ? prop.bankDetails : ""
        };
      })
      this.setState({ employeeList, pages })
    }, this.error);
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
  handleDeleteButton = (row) => {
    this.setState(prev => ({
      isAlart: true,
      alart: {
        onConfirm: () => deleteEmployee(row._id, this.handleDeleteSucess, this.error),
        title: "Are you sure?",
        cancelBtnBsStyle: "success",
        confirmBtnText: "Delete",
        cancelBtnText: "Cancel",
        showCancel: true,
        message: `Do you want to delete ${row.name}`,
        confirmBtnBsStyle: "danger",
        warning: true
      }
    }))
  }

  handleDeleteSucess = () => {
    this.setState({ isAlart: false });
    this.fetchDataFromServer()
    const alart = {
      onConfirm: () => this.setState({ isAlart: false }),
      title: "Successful",
      cancelBtnBsStyle: "success",
      confirmBtnText: "OK",
      cancelBtnText: "Cancel",
      showCancel: false,
      message: 'Employee deleted sucessfully',
      confirmBtnBsStyle: "success",
      success: true
    }
    this.setState({ isAlart: true, alart });
  }
  error = err => {
    this.setState({ isAlart: false });
    err.response.status === 501 ?
      this.setState({
        isAlart: true,
        alart: {
          onConfirm: () => this.setState({ isAlart: false }),
          title: "Access denied",
          cancelBtnBsStyle: "success",
          confirmBtnText: "Ok",
          cancelBtnText: "Cancel",
          showCancel: false,
          message: `this employee is reporting person of someone `,
          confirmBtnBsStyle: "success",
          warning: true
        }
      }) :
      this.setState({
        isAlart: true,
        alart: {
          onConfirm: () => this.setState({ isAlart: false }),
          cancelBtnBsStyle: "danger",
          confirmBtnText: "OK",
          showCancel: false,
          message: `Something went wrong!`,
          error: true
        }
      })
    console.log("err :", err);
  }
  render() {
    const trash = (<Tooltip id="trash_tooltip">Delete</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    let table = (
      <Col xs={12}>
        {
          (!this.state.employeeList || !this.state.employeeList.length) ? (
            <div>No employee found <a href="#/hrms/employees-edit/new">click here</a> to create one.</div>
          ) : (
              <div>
                <ReactTable
                  columns={[
                    {
                      Header: "Sr", accessor: "", width: 50, sortable: false, Cell: (d => {
                        let base = ((this.state.page) * this.state.pageSize)
                        return (<div>{base + d.index + 1}</div>)
                      })
                    },
                    { Header: "Emp ID", accessor: "empId", width: 100, sortable: false },
                    { Header: "Photo", accessor: "photo", sortable: false, Cell: this.renderPicture, width: 60, },
                    { Header: "Name", accessor: "name", width: 250, sortable: false },
                    { Header: "Email", accessor: "email", sortable: false },
                    { Header: "Contact NO", accessor: "phone", sortable: false },
                    { Header: "designation", accessor: "designation", sortable: false },
                    { Header: "reporting to", accessor: "_parent", sortable: false },
                    {
                      Header: "", accessor: "code", width: 60,
                      Cell: (row => {
                        return (
                          <div className="actions-right">
                            <OverlayTrigger placement="top" overlay={edit}>
                              <a role="button" className="fa fa-edit text-primary" href={"#/hrms/employees-edit/" + row.original.code}  >{null}</a>
                            </OverlayTrigger>
                            {cookie.load('role') === "Admin" && cookie.load("username").toString() !== row.original.empId.toString() &&
                              <OverlayTrigger placement="top" overlay={trash}>
                                <a role="button" className="fa fa-trash text-danger" onClick={() => this.handleDeleteButton(row.original)} >{null}</a>
                              </OverlayTrigger>
                            }
                          </div>
                        )
                      }),
                    }
                  ]}
                  data={this.state.employeeList}
                  minRows={0}
                  sortable={false}
                  className="-striped -highlight"
                  showPaginationTop={false}
                  showPaginationBottom={true}
                  loading={this.state.loading}
                  page={this.state.page}
                  pageSize={this.state.pageSize}
                  pages={this.state.pages}
                  defaultPageSize={defaultPageSize}
                  pageSizeOptions={pageSizeOptionsList}
                  manual
                  freezeWhenExpanded={true}
                  onPageChange={(page) => { this.setState({ page: page }); setTimeout(() => this.fetchDataFromServer(), 100) }}
                  onPageSizeChange={(pageSize) => { this.setState({ pageSize: pageSize, page: 0 }); setTimeout(() => this.fetchDataFromServer(), 100) }}
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
            <ControlLabel>Employee Name</ControlLabel>
            <FormControl
              onChange={this.handleSearchByEmployee}
              type="text"
              value={this.state.searchByEmployee}
              placeholder="Search by name"
            />
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={9} lg={9}>
          <Button pullRight bsStyle="primary" fill onClick={() => this.props.history.push("/hrms/employees-edit/new")}>
            <i className="fa fa-plus" /> Add New Employee
						</Button>
        </Col>
      </div>
    )
    return (
      <div>
      <div>
        {this.state.alert}
        {header}
        {table}
      </div>

      <SweetAlert
        show={this.state.isAlart}
        style={{ display: "block", marginTop: "-100px" }}
        onCancel={() => this.setState({ isAlart: false })}
        onConfirm={() => this.setState({ isAlart: false })}
        title=''
        {...this.state.alart}>
        {this.state.alart.message}
      </SweetAlert>
      </div >
    );
  }
}

export default EmployeeListComponent;