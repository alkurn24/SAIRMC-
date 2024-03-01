import React, { Component } from "react";

import TestCaseListComponent from "../components/TestCaseListComponent.jsx";

class TestCaseListPage extends Component {
	render() {
		return (
			<TestCaseListComponent {...this.props}></TestCaseListComponent>
		);
	}
}

export default TestCaseListPage;
