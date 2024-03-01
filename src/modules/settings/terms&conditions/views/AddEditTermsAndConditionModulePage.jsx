import React, { Component } from "react";

import TermsAndConditionFormComponent from "templates/components/TermsAndConditionFormComponent.jsx";

class AddEditTermsAndConditionModulePage extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }
  render() {
    return (
      <TermsAndConditionFormComponent settings={false} {...this.props}></TermsAndConditionFormComponent>
    )
  }
}

export default AddEditTermsAndConditionModulePage;