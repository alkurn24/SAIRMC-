import React, { Component } from "react";

import UserFormComponent from "templates/components/UserFormComponent.jsx";

class AddEditModulePage extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }
  render() {
    return (
      <UserFormComponent settings={false} {...this.props}></UserFormComponent>
    )
  }
}

export default AddEditModulePage;