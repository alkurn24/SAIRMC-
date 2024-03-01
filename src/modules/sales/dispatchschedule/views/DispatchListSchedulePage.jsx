import React, { Component } from "react";
import DispatchScheduleListComponent from "../components/DispatchScheduleListComponent.jsx";
import DispatchcompletedListComponent from "../components/DispatchcompletedListComponent.jsx";
import { Row, Col, Tab, Nav, NavItem } from "react-bootstrap";

class StoresListPage extends Component {
	render() {
		return (
			<Tab.Container id="tabs-with-dropdown" defaultActiveKey="schedule">
				<Row className="clearfix">
					<Col xs={12} className="top">
						<Nav bsStyle="tabs">
							<NavItem eventKey="schedule" className="text-center"><i className="" /> Dispatch schedule list</NavItem>
							<NavItem eventKey="complete" className="text-center"><i className="" />Completed dispatch schedule list</NavItem>
						</Nav>
					</Col>
					<Col xs={12} className="top">
						<Tab.Content animation>
							<Tab.Pane eventKey="schedule"><DispatchScheduleListComponent {...this.props}></DispatchScheduleListComponent></Tab.Pane>
							<Tab.Pane eventKey="complete"><DispatchcompletedListComponent {...this.props}></DispatchcompletedListComponent></Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		)
	}
}

export default StoresListPage;
