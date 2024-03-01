import React, { Component } from "react";
import EmployeeFormComponent from "../components/EmployeeFormComponent.jsx";

class AddEditEmployeePage extends Component {
  render() {
    return (
      <EmployeeFormComponent settings={false} {...this.props}></EmployeeFormComponent>
    )
  }
}

export default AddEditEmployeePage;