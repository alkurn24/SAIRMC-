import React, { Component } from "react";
import TestReportFormComponent from "../components/TestReportFormComponent.jsx";

class AddEditTestReportPage extends Component {
  render() {
    return (
      <TestReportFormComponent {...this.props}></TestReportFormComponent>
    )
  }
}

export default AddEditTestReportPage;