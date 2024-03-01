import React, { Component } from "react";
import LeaveTypeListComponent from "../components/LeaveTypeListComponent.jsx";

class LeaveTypeListPage extends Component {
	render() {
		return (
			<div>
				<LeaveTypeListComponent {...this.props}></LeaveTypeListComponent>
			</div>
		);
	}
}

export default LeaveTypeListPage;
