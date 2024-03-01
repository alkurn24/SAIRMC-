import React, { Component } from "react";
import EmployeeListComponent from "../components/EmployeeListComponent.jsx";
import EmployeeDashboard from "../components/EmployeeDashboard.jsx";
import PayrollDashboard from "../components/PayrollDashboard.jsx";
import LeaveTrackingFormComponent from "../components/LeaveTracking.jsx";
import ReimbursementComponent from "../components/ReimbursementComponent.jsx";
import EmployeeOrgComponent from "../components/EmployeeOrgComponent.jsx";
import DesignationOrgChart from "../components/DesignationOrgChart.jsx";
import SweetAlert from "react-bootstrap-sweetalert";
import cookie from 'react-cookies';

import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class EmployeeListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myWorklist: [],
      selectedTab: props.location.pathname === "/hrms/employees/list" ? "employees" : "dashboard",
      // selectedTab: "dashboard",
      alert: null,
      stats: {
        customers: 0,
        locations: 0,
        addresses: 0,
        contacts: 0,
        clients: 0,
        consultants: 0,
        contractors: 0
      }
    }
  }
  // componentWillMount() {
  //   getEmployeeDetails(null, this.success, this.props.error)
  // }
  // success = ({ employee, events = [], myWorklist = [] }) => {
  //   this.setState(prev => ({ employee, events, myWorklist }))
  // }
  errorAlert = (message) => {
    this.setState({
      alert: (
        <SweetAlert
          error
          style={{ display: "block", marginTop: "-100px" }}
          title="Something went wrong."
          onConfirm={() => this.setState({ alert: null })}
          onCancel={() => this.setState({ alert: null })}
          confirmBtnBsStyle="info"
        >
        </SweetAlert>
      )
    });
  }
  render() {
    return (
      <Tab.Container id="tabs-with-dropdown"
        defaultActiveKey={this.state.selectedTab}
        onSelect={(value) => {
          this.setState({ selectedTab: value })
        }}
      >
        <Row className="clearfix">
          <Col xs={12} className="top">
            <Nav bsStyle="tabs">
              <NavItem eventKey="dashboard" className="text-center"><i className="" />Dashboard</NavItem>
              {cookie.load('role') === "Admin" && <NavItem eventKey="employees" className="text-center"><i className="" />Employees </NavItem>}
              <NavItem eventKey="leaveTracking" className="text-center"><i className="" />Leave Tracking</NavItem>
              <NavItem eventKey="orgChartEmployee" className="text-center"><i className="" />Employee Tree </NavItem>
              <NavItem eventKey="orgChart" className="text-center"><i className="" />Org Chart </NavItem>
              <NavItem eventKey="payroll" className="text-center"><i className="" />Payroll </NavItem>
              <NavItem eventKey="reimbursement" className="text-center"><i className="" />Reimbursement </NavItem>
            </Nav>
          </Col>
          <Col xs={12} className="top">
            <Tab.Content animation>
              {
                this.state.selectedTab === "employees" && cookie.load("role") === "Admin" &&
                <Tab.Pane eventKey="employees"><EmployeeListComponent {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "dashboard" &&
                <Tab.Pane eventKey="dashboard"><EmployeeDashboard {...this.props} {...this.state} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "leaveTracking" &&
                <Tab.Pane eventKey="leaveTracking"><LeaveTrackingFormComponent {...this.props} {...this.state} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "orgChartEmployee" &&
                <Tab.Pane eventKey="orgChartEmployee"><EmployeeOrgComponent {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "orgChart" &&
                <Tab.Pane eventKey="orgChart"><DesignationOrgChart {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "payroll" &&
                <Tab.Pane eventKey="payroll"><PayrollDashboard {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
              }
              {
                this.state.selectedTab === "reimbursement" &&
                <Tab.Pane eventKey="reimbursement"><ReimbursementComponent {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

export default EmployeeListPage;