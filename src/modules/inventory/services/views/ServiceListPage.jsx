import React, { Component } from "react";
import ServiceListComponent from "../components/ServiceListComponent.jsx";

class ServiceListPage extends Component {
	render() {
		return (
			<ServiceListComponent {...this.props}></ServiceListComponent>
		);
	}
}

export default ServiceListPage;
