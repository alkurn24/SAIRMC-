import React, { Component } from "react";
import DispatchQaApprovalComponent from "../components/DispatchQaApprovalComponent.jsx";
import MovementQaApprovalComponent from "../components/MovementQaApprovalComponent.jsx";
import GrnScheduletQaApprovalComponent from "../components/GrnScheduletQaApprovalComponent.jsx";
import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class MyWorklistPage extends Component {
	render() {
		return (
			<Tab.Container id="tabs-with-dropdown" defaultActiveKey="dispatch-approval">
				<Row className="clearfix">
				<Col xs={12} className="top">
						<Nav bsStyle="tabs">
							<NavItem eventKey="dispatch-approval" className="text-center"><i className="" />Dispatch  Approval</NavItem>
							<NavItem eventKey="movement-approval" className="text-center"><i className="" />Movement Approval</NavItem>
							<NavItem eventKey="grn-approval" className="text-center"><i className="" />GRN Schedule Approval</NavItem>
						</Nav>
					</Col>
					<Col xs={12} className="top">
						<Tab.Content animation>
							<Tab.Pane eventKey="dispatch-approval"><DispatchQaApprovalComponent {...this.props} /></Tab.Pane>
							<Tab.Pane eventKey="movement-approval"><MovementQaApprovalComponent {...this.props} /></Tab.Pane>
							<Tab.Pane eventKey="grn-approval"><GrnScheduletQaApprovalComponent {...this.props} /></Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		)
	}
}

export default MyWorklistPage;
