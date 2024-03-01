import React, { Component } from "react";
import GrnFormComponent from "../components/GrnFormComponent.jsx";

class AddEditGrnPage extends Component {
  render() {
    return (
      <GrnFormComponent {...this.props}></GrnFormComponent>
    )
  }
}

export default AddEditGrnPage;