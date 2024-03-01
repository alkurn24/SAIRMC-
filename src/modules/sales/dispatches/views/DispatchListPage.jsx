

import React, { Component } from "react";

import DispatchListComponent from "../components/DispatchListComponent.jsx";

class DispatchListPage extends Component {
	render() {
		return (
			<DispatchListComponent moduleName="Dispatch"{...this.props}></DispatchListComponent>
		);
	}
}

export default DispatchListPage;

