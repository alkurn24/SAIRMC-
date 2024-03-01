import React, { Component } from "react";
import TermsListComponent from "../components/TermsListComponent.jsx";

class TermsListPage extends Component {
	render() {
		return (
			<TermsListComponent {...this.props}></TermsListComponent>
		);
	}
}

export default TermsListPage;
