
import React, { Component } from "react";
import VendorsFormComponent from "../components/VendorsFormComponent.jsx";

class AddEditVendorsPage extends Component {
  render() {
    return (
      <VendorsFormComponent settings={false} {...this.props}></VendorsFormComponent>
    )
  }
}

export default AddEditVendorsPage;