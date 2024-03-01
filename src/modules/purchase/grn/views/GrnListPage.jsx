
import React, { Component } from "react";

import GrnListComponent from "../components/GrnListComponent.jsx";

class GrnListPage extends Component {
	render() {
		return (
			<GrnListComponent moduleName="grn"{...this.props}></GrnListComponent>
		);
	}
}

export default GrnListPage;
