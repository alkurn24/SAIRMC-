import React, { Component } from "react";
import CustomerFormComponent from "../components/CustomerFormComponent.jsx";

class AddEditCustomer extends Component {
  render() {
    return (
      <CustomerFormComponent settings={false} {...this.props}></CustomerFormComponent>
    )
  }
}

export default AddEditCustomer;