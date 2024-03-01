import React, { Component } from "react";
import TestMaterialFormComponent from "../components/TestMaterialFormComponent.jsx";

class AddEditTestMaterialPage extends Component {
  render() {
    return (
      <TestMaterialFormComponent {...this.props}></TestMaterialFormComponent>
    )
  }
}

export default AddEditTestMaterialPage;