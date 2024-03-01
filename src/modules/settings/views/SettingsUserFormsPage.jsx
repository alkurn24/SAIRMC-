import React, { Component } from "react";
import { Col, Nav, NavItem, Tab } from "react-bootstrap";

import SalesModuleFormComponent from "modules/sales/components/SalesModuleFormComponent.jsx";
//import ProductFormComponent from "inventory/components/ProductFormComponent.jsx";
// import ServiceFormComponent from "inventory/components/ServiceFormComponent.jsx";
import CustomerFormComponent from "modules/crm/customers/components/CustomerFormComponent.jsx";

class SettingsUserFormsPage extends Component {
  render() {
    let settingsFormsTabs = (
      <Tab.Container id="tabs-with-dropdown" defaultActiveKey="inquiry">
        <div className="clearfix">
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="inquiry">Inquiry</NavItem>
              <NavItem eventKey="quotation">Quotation</NavItem>
              <NavItem eventKey="order">Order</NavItem>
              <NavItem eventKey="product">Product</NavItem>
              {/* <NavItem eventKey="service">Service</NavItem> */}
              <NavItem eventKey="customer">Customer</NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="inquiry">
                <SalesModuleFormComponent moduleName="Inquiry" settingsForm="inquiryForm" settings={true} {...this.props}></SalesModuleFormComponent>
              </Tab.Pane>
              <Tab.Pane eventKey="quotation">
                <SalesModuleFormComponent moduleName="Quotation" settingsForm="quotationForm" settings={true} {...this.props}></SalesModuleFormComponent>
              </Tab.Pane>
              <Tab.Pane eventKey="order">
                <SalesModuleFormComponent moduleName="Order" settingsForm="orderForm" settings={true} {...this.props}></SalesModuleFormComponent>
              </Tab.Pane>
              {/* <Tab.Pane eventKey="product">
                <ProductFormComponent settings={true} {...this.props}></ProductFormComponent>
              </Tab.Pane> */}
              {/* <Tab.Pane eventKey="service">
                <ServiceFormComponent settings={true} {...this.props}></ServiceFormComponent>
              </Tab.Pane> */}
              <Tab.Pane eventKey="customer">
                <CustomerFormComponent settings={true} {...this.props}></CustomerFormComponent>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </div>
      </Tab.Container>
    );
    return (
      <div>
        {settingsFormsTabs}
      </div>
    )
  }
}

export default SettingsUserFormsPage;