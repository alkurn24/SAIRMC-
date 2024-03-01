import React, { Component } from "react";
import MovementListComponent from "../components/MovementListComponent.jsx";
import OutwardListComponent from "../components/OutwardListComponent.jsx";
import ReturnableListComponent from "../components/ReturnableListComponent.jsx";
import InwardListComponent from "../components/InwardListComponent.jsx";
import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class StoresListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "movement-all",
    }
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
              <NavItem eventKey="movement-all" className="text-center"><i className="" />All</NavItem>
              <NavItem eventKey="outward-list" className="text-center"><i className="" /> Outward List</NavItem>
              <NavItem eventKey="inward-list" className="text-center"><i className="" /> Inward List</NavItem>
              <NavItem eventKey="returnable-list" className="text-center"><i className="" /> Returnable List</NavItem>
            </Nav>
          </Col>
          <Col xs={12} className="top">
            <Tab.Content animation>
              {
                this.state.selectedTab === "movement-all" ?
                  <Tab.Pane eventKey="movement-all"><MovementListComponent {...this.props}></MovementListComponent></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "outward-list" ?
                  <Tab.Pane eventKey="outward-list"><OutwardListComponent {...this.props}></OutwardListComponent></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "inward-list" ?
                  <Tab.Pane eventKey="inward-list"><InwardListComponent {...this.props}></InwardListComponent></Tab.Pane>
                  : null
              }
              {
                this.state.selectedTab === "returnable-list" ?
                  <Tab.Pane eventKey="returnable-list"><ReturnableListComponent {...this.props}></ReturnableListComponent></Tab.Pane>
                  : null
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

export default StoresListPage;
