
import React, { Component } from "react";
import PurchaseRequestFormComponent from "../components/PurchaseRequestFormComponent.jsx";

class AddEditPurchaseRequestPage extends Component {
  render() {
    return (
      <PurchaseRequestFormComponent moduleName="purchaseRequest" settingsForm="orderForm" settings={false} {...this.props}></PurchaseRequestFormComponent>
    )
  }
}

export default AddEditPurchaseRequestPage;