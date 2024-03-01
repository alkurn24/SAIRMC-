
import React, { Component } from "react";
import PurchaseModuleFormComponent from "../components/PurchaseModuleFormComponent.jsx";

class AddEditOrderPage extends Component {
  render() {
    return (
      <PurchaseModuleFormComponent moduleName="Order" settingsForm="orderForm" settings={false} {...this.props}></PurchaseModuleFormComponent>
    )
  }
}

export default AddEditOrderPage;