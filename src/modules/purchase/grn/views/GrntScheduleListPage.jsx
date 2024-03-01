
import React, { Component } from "react";

import GrnScheduleFormComponent from "../components/GrnScheduleFormComponent.jsx";

class GrntScheduleListPage extends Component {
  render() {
    return (
      <GrnScheduleFormComponent {...this.props}></GrnScheduleFormComponent>
    );
  }
}

export default GrntScheduleListPage;
