import React, { Component } from "react";
import PlantListComponent from "../components/PlantListComponent.jsx";

class PlantListPage extends Component {
	render() {
		return (
			<PlantListComponent {...this.props}></PlantListComponent>
		);
	}
}

export default PlantListPage;
