import React, { Component } from "react";

import ProductionScheduleFormComponent from "../components/ProductionScheduleFormComponent.jsx";

class ProductScheduleListPage extends Component {
	render() {
		return (
			<ProductionScheduleFormComponent {...this.props}></ProductionScheduleFormComponent>
		);
	}
}

export default ProductScheduleListPage;
