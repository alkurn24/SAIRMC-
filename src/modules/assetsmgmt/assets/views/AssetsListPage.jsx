import React, { Component } from "react";
import AssetsListComponent from "../components/AssetsListComponent.jsx";

class AssetsListPage extends Component {
	render() {
		return (
			<AssetsListComponent {...this.props}></AssetsListComponent>
		);
	}
}

export default AssetsListPage;
