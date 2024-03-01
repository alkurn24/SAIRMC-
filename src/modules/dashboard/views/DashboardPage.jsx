import React, { Component } from "react";
import cookie from 'react-cookies';

import DashboardFormComponent from "../components/DashboardFormComponent.jsx";
import PurchaseOrderDashboardFormComponent from "../components/PurchaseOrderDashboardFormComponent.jsx";

class DashboardPage extends Component {
	render() {
		return (
			cookie.load('role') === "admin" || cookie.load('role') === "sales" ?
				<DashboardFormComponent {...this.props}></DashboardFormComponent>
				: cookie.load('role') === "purchase" ?
					<PurchaseOrderDashboardFormComponent {...this.props}></PurchaseOrderDashboardFormComponent>
					: null
		);
	}
}

export default DashboardPage;
