import React, { Component } from "react";
import PayrollHeadsComponent from "../components/PayrollHeadsComponent.jsx";

export default class PayrollHeadsPage extends Component {
	render() {
		return (
			<div>
				<PayrollHeadsComponent {...this.props}></PayrollHeadsComponent>
			</div>
		);
	}
}

