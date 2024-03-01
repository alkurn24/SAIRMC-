import React, { Component } from "react";
import UnitListComponent from "../components/UnitListComponent.jsx";

class HsnListPage extends Component {
	render() {
		return (
			<UnitListComponent {...this.props}></UnitListComponent>
		);
	}
}

export default HsnListPage;
