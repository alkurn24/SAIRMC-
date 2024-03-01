import React, { Component } from "react";
import TemplateFormComponent from "templates/components/TemplateFormComponent.jsx";

class AddEditInventoryPage extends Component {
  render() {
    return (
      <TemplateFormComponent settings={false} {...this.props}></TemplateFormComponent>
    )
  }
}

export default AddEditInventoryPage;