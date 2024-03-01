
import React, { Component } from "react";

import DispatchFormComponent from "../components/DispatchFormComponent.jsx";

class AddEditDispatch extends Component {
  render() {
    return (
      <DispatchFormComponent settings={false} {...this.props}></DispatchFormComponent>
    )
  }
}

export default AddEditDispatch;