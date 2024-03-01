import React, { Component } from "react";
import VendorsListComponent from "../components/VendorsListComponent.jsx";
import AddressesListComponent from "modules/common/addresses/components/AddressesListComponent.jsx";
import ContactsListComponent from "modules/common/contacts/components/ContactsListComponent.jsx";
import { getVendorStats } from "../server/VendorServerComm.jsx";

import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";


class VendorsListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "vendor",
      stats: {
        vendor: 0,
        locations: 0,
        addresses: 0,
        contacts: 0,
        clients: 0,
        consultants: 0,
        contractors: 0
      }
    }

    this.getVendorStats = this.getVendorStats.bind(this);
  }

  componentWillMount() {
    this.getVendorStats();
  }

  getVendorStats() {
    let _this = this;
    getVendorStats(
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
              {/* <NavItem eventKey="vendor" className="text-center"><i className="" />vendors ({this.state.stats.vendors})</NavItem>
              <NavItem eventKey="addresses" className="text-center"><i className="" />Addresses ({this.state.stats.addresses})</NavItem>
              <NavItem eventKey="contacts" className="text-center"><i className="" />Contacts ({this.state.stats.contacts})</NavItem> */}
              <NavItem eventKey="vendor" className="text-center"><i className="" />vendors </NavItem>
              <NavItem eventKey="addresses" className="text-center"><i className="" />Addresses </NavItem>
              <NavItem eventKey="contacts" className="text-center"><i className="" />Contacts </NavItem>
            </Nav>
          </Col>
          <Col xs={12} className="top">
            <Tab.Content animation>
              {
                this.state.selectedTab === "vendor"
                  ? <Tab.Pane eventKey="vendor"><VendorsListComponent {...this.props} getVendorStats={this.getVendorStats} /></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "addresses"
                  ? <Tab.Pane eventKey="addresses"><AddressesListComponent {...this.props} getVendorStats={this.getVendorStats} list view="vendor" /></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "contacts"
                  ? <Tab.Pane eventKey="contacts"><ContactsListComponent {...this.props} getVendorStats={this.getVendorStats} list view="vendor" /></Tab.Pane>
                  : null
              }

            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

export default VendorsListPage;