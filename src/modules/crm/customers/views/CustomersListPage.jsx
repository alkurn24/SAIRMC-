import React, { Component } from "react";
import CustomerListComponent from "../components/CustomerListComponent.jsx";
import AddressesListComponent from "modules/common/addresses/components/AddressesListComponent.jsx";
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent.jsx";
import { getCustomerStats } from "modules/crm/customers/server/CustomerServerComm.jsx";

import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";


class CustomerListComponentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "customers",
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

    this.getCustomerStats = this.getCustomerStats.bind(this);
  }

  componentWillMount() {
    this.getCustomerStats();
  }

  getCustomerStats() {
    let _this = this;
    getCustomerStats(
      "",
      (data) => { _this.setState({ stats: data }) },
      () => { }
    )
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
              {/* <NavItem eventKey="customers" className="text-center"><i className="" />Customers ({this.state.stats.customers})</NavItem>
              <NavItem eventKey="addresses" className="text-center"><i className="" />Addresses ({this.state.stats.addresses})</NavItem>
              <NavItem eventKey="contacts" className="text-center"><i className="" />Contacts ({this.state.stats.contacts})</NavItem> */}
              <NavItem eventKey="customers" className="text-center"><i className="" />Customers </NavItem>
              <NavItem eventKey="addresses" className="text-center"><i className="" />Addresses </NavItem>
              <NavItem eventKey="contacts" className="text-center"><i className="" />Contacts </NavItem>
            </Nav>
          </Col>
          <Col xs={12} className="top">
            <Tab.Content animation>
              {
                this.state.selectedTab === "customers"
                  ? <Tab.Pane eventKey="customers"><CustomerListComponent {...this.props} getCustomerStats={this.getCustomerStats} /></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "addresses"
                  ? <Tab.Pane eventKey="addresses"><AddressesListComponent {...this.props} getCustomerStats={this.getCustomerStats} list view="customer" /></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "contacts"
                  ? <Tab.Pane eventKey="contacts"><ContactsListComponent {...this.props} getCustomerStats={this.getCustomerStats} list view="customer" /></Tab.Pane>
                  : null
              }

            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

export default CustomerListComponentPage;