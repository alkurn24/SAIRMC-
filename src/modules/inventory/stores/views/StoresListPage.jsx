import React, { Component } from "react";
import StoresListComponent from "../components/StoresListComponent.jsx";
import StoresStatusComponent from "../components/StoresStatusComponent.jsx";
import DieselConsumptionListComponent from "../components/DieselConsumptionListComponent.jsx";
import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class StoresListPage extends Component {
	render() {
		return (
			<Tab.Container id="tabs-with-dropdown" defaultActiveKey="store-list">
				<Row className="clearfix">
					<Col xs={12} className="top">
						<Nav bsStyle="tabs">
							<NavItem eventKey="store-list" className="text-center"><i className="" />Store Items List</NavItem>
							<NavItem eventKey="stock-status" className="text-center"><i className="" />Stock Status</NavItem>
							<NavItem eventKey="diesel" className="text-center"><i className="" />Diesel Stock </NavItem>
						</Nav>
					</Col>
					<Col xs={12} className="top">
						<Tab.Content animation>
							<Tab.Pane eventKey="store-list"><StoresListComponent {...this.props}></StoresListComponent></Tab.Pane>
							<Tab.Pane eventKey="stock-status"><StoresStatusComponent {...this.props}></StoresStatusComponent></Tab.Pane>
							<Tab.Pane eventKey="diesel"><DieselConsumptionListComponent {...this.props}></DieselConsumptionListComponent></Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		)
	}
}

export default StoresListPage;
