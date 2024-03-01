import React, { Component } from "react";
import SalesModuleListComponent from "../components/SalesModuleListComponent.jsx";
import CustomerPoListComponent from "../components/CustomerPoListComponent.jsx";
import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class StoresListPage extends Component {
  render() {
    return (
      <Tab.Container id="tabs-with-dropdown" defaultActiveKey="order-list">
        <Row className="clearfix">
          <Col xs={12} className="top">
            <Nav bsStyle="tabs">
              <NavItem eventKey="order-list" className="text-center"><i className="" />Order list</NavItem>
              <NavItem eventKey="po-list" className="text-center"><i className="" /> Order without PO list</NavItem>
            </Nav>
          </Col>
          <Col xs={12} className="top">
            <Tab.Content animation>
              <Tab.Pane eventKey="order-list"><SalesModuleListComponent {...this.props}></SalesModuleListComponent></Tab.Pane>
              <Tab.Pane eventKey="po-list"><CustomerPoListComponent {...this.props}></CustomerPoListComponent></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

export default StoresListPage;
