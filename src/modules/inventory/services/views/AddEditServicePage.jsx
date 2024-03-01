import React, { Component } from "react";
import AddEditServiceComponent from "../components/AddEditServiceComponent.jsx";

class AddEditServicePage extends Component {
  render() {
    return (
      <AddEditServiceComponent {...this.props}></AddEditServiceComponent>
    )
  }
}

export default AddEditServicePage;