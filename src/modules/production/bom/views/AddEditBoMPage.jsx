import React, { Component } from "react";
import BoMFormComponent from "../components/BoMFormComponent.jsx";

class AddEditBoMPage extends Component {
  render() {
    return (
      <BoMFormComponent {...this.props}></BoMFormComponent>
    )
  }
}

export default AddEditBoMPage;