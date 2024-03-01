import React, { Component } from "react";
import { Modal, Col, OverlayTrigger, Tooltip, } from "react-bootstrap";
import cookie from 'react-cookies';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { backendURL } from 'variables/appVariables.jsx';

import avatar from "assets/img/default-avatar.png";

import EmployeeFormComponent from "../components/EmployeeFormComponent"
import { getEmployeeOrgChart } from "../server/EmployeeServerComm";

class EmployeeOrgComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: {}
    }
    this.fetchDataFromServer = this.fetchDataFromServer.bind(this);
    this.nodeComponent = this.nodeComponent.bind(this);
    this.handleShowEmployeeModal = this.handleShowEmployeeModal.bind(this);
    this.handleHideEmployeeModal = this.handleHideEmployeeModal.bind(this);
    this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
  }

  componentWillMount() {
    this.fetchDataFromServer();
  }

  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      this.props = newProps;
      this.fetchDataFromServer();
    }
  }

  fetchDataFromServer() {
    let _this = this;
    getEmployeeOrgChart("view=org",
      (data) => {
        _this.setState({ employees: data })
      },
      (err) => { console.log(err);
      }
    )
  }

  nodeComponent(node) {
    const add = (<Tooltip id="add_tooltip">Add</Tooltip>);
    const edit = (<Tooltip id="edit_tooltip">Edit</Tooltip>);
    return (
      <div className="initechNode value-success" >
        <Col xs={12} sm={12} md={12} lg={12}>
          {/* <div className="" onClick={() => this.handleShowEmployeeModal(node, "edit")}>{node.node.name}</div> */}
          <div className="photo">
            {node.node.photo ?
              <img src={backendURL + node.node.photo} alt="" style={{ height: "25px", width: "25px", borderRadius: "25px" }} />
              :
              <img src={avatar} alt="" style={{ height: "25px", width: "25px", borderRadius: "25px" }} />
            }
          </div>
          <div>{node.node.name}</div>
          <div>{node.node.designation}</div>
          {/* {node.node.name === undefined ?
            null
            :
            <OverlayTrigger placement="top" overlay={edit}>
              <a role="button" className="fa fa-edit text-primary" style={{ marginLeft: "10px" }} onClick={() => this.handleShowEmployeeModal(node, "edit")}  >{null}</a>
            </OverlayTrigger>
          }

          <OverlayTrigger placement="top" overlay={add}>
            <a role="button" className="fa fa-plus text-primary" style={{ marginLeft: "10px" }} onClick={() => this.handleShowEmployeeModal(node, "new")}  >{null}</a>
          </OverlayTrigger>
          {/* {
            node.node.children && node.node.children.length === 0
            ? <a className="fa fa-trash" style={{ marginRight: "5px" }} onClick={() => this.handleDeleteEmployee(node)}>{null}</a>
            : null
          } */}

        </Col>
      </div>
    );
  }

  handleShowEmployeeModal(node, type) {
    this.setState({
      _parent: type === "new" ? node : null,
      employee: type === "new" ? null : node,
      showEmployeeModal: true
    });
  }

  handleHideEmployeeModal() {
    this.setState({
      _parent: null,
      employee: null,
      showEmployeeModal: false
    });
    this.fetchDataFromServer();
  }

  handleDeleteEmployee(node) {

  }

  render() {

    let employeeViewModal = (
      <Modal
        dialogClassName="large-modal"
        show={this.state.showEmployeeModal}
        onHide={this.handleHideEmployeeModal}
      >
        <Modal.Header closeButton>Add/Edit Employee</Modal.Header>
        <Modal.Body>
          <EmployeeFormComponent
            {...this.props}
            _parent={this.state._parent}
            employee={this.state.employee ? this.state.employee.node : null}
            handleHideEmployeeModal={this.handleHideEmployeeModal} />
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    )
    return (
      <div>
        <Col xs={12} sm={12} md={12} lg={12}>
          {employeeViewModal}
          <OrgChart tree={this.state.employees} NodeComponent={this.nodeComponent} />
        </Col>
      </div>
    )
  }
}

export default EmployeeOrgComponent;
