import React, { Component } from "react";

import TestMaterialListComponent from "../components/TestMaterialListComponent.jsx";

class TestMaterialListPage extends Component {
	render() {
		return (
			<TestMaterialListComponent {...this.props}></TestMaterialListComponent>
		);
	}
}

export default TestMaterialListPage;
