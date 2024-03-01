import React, { Component } from "react";
import TestCaseFormComponent from "../components/TestCaseFormComponent.jsx";

class AddEditTestCasePage extends Component {
  render() {
    return (
      <TestCaseFormComponent {...this.props}></TestCaseFormComponent>
    )
  }
}

export default AddEditTestCasePage;