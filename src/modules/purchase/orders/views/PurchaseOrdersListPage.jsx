
import React, { Component } from "react";

import PurchaseModuleListComponent from "../components/PurchaseModuleListComponent.jsx";

class PurchaseOrdersListPage extends Component {
  render() {
    return (
      <PurchaseModuleListComponent moduleName="Order" {...this.props} > </PurchaseModuleListComponent>
    );
  }
}

export default PurchaseOrdersListPage;
