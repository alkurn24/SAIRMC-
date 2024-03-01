import React, { Component } from "react";
import TransporterFormComponent from "../components/TransporterFormComponent.jsx";

class AddEditTransporterPage extends Component {
  render() {
    return (
      <TransporterFormComponent settings={false} {...this.props}></TransporterFormComponent>
    )
  }
}

export default AddEditTransporterPage;