import React, { Component } from "react";
import MaintenanceListComponent from "../components/MaintenanceListComponent.jsx";

class MaintenanceLogListPage extends Component {
	render() {
		return (
			<MaintenanceListComponent {...this.props}></MaintenanceListComponent>
		);
	}
}

export default MaintenanceLogListPage;
