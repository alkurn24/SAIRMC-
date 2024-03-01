
import React, { Component } from "react";

import PurchaseRequestListComponent from "../components/PurchaseRequestListComponent.jsx";

class PurchaseRequestListPage extends Component {
  render() {
    return (
      <PurchaseRequestListComponent moduleName="Order" {...this.props} > </PurchaseRequestListComponent>
    );
  }
}

export default PurchaseRequestListPage;
