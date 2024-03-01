import React, { Component } from "react";
import AddEditMovementComponent from "../components/AddEditMovementComponent.jsx";

class AddEditMovementPage extends Component {
  render() {
    return (
      <AddEditMovementComponent {...this.props}></AddEditMovementComponent>
    )
  }
}

export default AddEditMovementPage;