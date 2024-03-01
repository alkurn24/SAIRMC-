import React, { Component } from "react";

import BoMListComponent from "../components/BoMListComponent.jsx";

class BoMListPage extends Component {
	render() {
		return (
			<BoMListComponent {...this.props}></BoMListComponent>
		);
	}
}

export default BoMListPage;
