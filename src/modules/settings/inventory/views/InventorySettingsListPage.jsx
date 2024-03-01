import React, { Component } from "react";
import InventorySettingsListComponent from "../components/InventorySettingsListComponent.jsx";

class InventorySettingsListPage extends Component {
	render() {
		return (
			<InventorySettingsListComponent {...this.props}></InventorySettingsListComponent>
		);
	}
}

export default InventorySettingsListPage;
