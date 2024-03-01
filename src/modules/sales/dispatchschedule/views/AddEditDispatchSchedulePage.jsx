
import React, { Component } from "react";

import DispatchScheduleFormComponent from "../components/DispatchScheduleFormComponent.jsx";

class AddEditDispatchSchedulePage extends Component {
  render() {
    return (
      <DispatchScheduleFormComponent settings={false} {...this.props}></DispatchScheduleFormComponent>
    )
  }
}

export default AddEditDispatchSchedulePage;