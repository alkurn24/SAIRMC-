import React, { Component } from "react";
import HsnListComponent from "../components/HsnListComponent.jsx";

class HsnListPage extends Component {
	render() {
		return (
			<HsnListComponent {...this.props}></HsnListComponent>
		);
	}
}

export default HsnListPage;
