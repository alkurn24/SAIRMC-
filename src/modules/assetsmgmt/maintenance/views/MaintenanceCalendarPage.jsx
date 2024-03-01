import React, { Component } from "react";
import MaintenanceCalendarComponent from "../components/MaintenanceCalendarComponent.jsx";

class MaintenanceLogListPage extends Component {
	render() {
		return (
			<MaintenanceCalendarComponent {...this.props}></MaintenanceCalendarComponent>
		);
	}
}

export default MaintenanceLogListPage;