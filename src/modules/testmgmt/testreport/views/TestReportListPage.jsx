import React, { Component } from "react";

import TestReportListComponent from "../components/TestReportListComponent.jsx";

class TestReportListPage extends Component {
	render() {
		return (
			<TestReportListComponent {...this.props}></TestReportListComponent>
		);
	}
}

export default TestReportListPage;
