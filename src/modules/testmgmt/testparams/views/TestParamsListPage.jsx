import React, { Component } from "react";
import { Row } from "react-bootstrap";
import TestParamsListComponent from "../components/TestParamsListComponent.jsx";

class ModuleListPage extends Component {
	render() {
		return (
			<Row>
				<TestParamsListComponent {...this.props}></TestParamsListComponent>
			</Row>
		);
	}
}

export default ModuleListPage;
