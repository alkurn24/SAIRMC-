
import React, { Component } from "react";

import SalesModuleFormComponent from "modules/sales/orders/components/SalesModuleFormComponent.jsx";

class AddEditOrderPage extends Component {
  render() {
    return (
      <SalesModuleFormComponent moduleName="Order" settingsForm="orderForm" settings={false} {...this.props}></SalesModuleFormComponent>
    )
  }
}

export default AddEditOrderPage;