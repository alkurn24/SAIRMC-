import React, { Component } from "react";
import ProductFormComponent from "../components/ProductFormComponent.jsx";

class AddEditProductPage extends Component {
  render() {
    return (
      <ProductFormComponent {...this.props}></ProductFormComponent>
    )
  }
}

export default AddEditProductPage;