import React, { Component } from "react";
import AddEditAssetsComponent from "../components/AddEditAssetComponent.jsx";

class AddEditAssetsPage extends Component {
  render() {
    return (
      <AddEditAssetsComponent {...this.props}></AddEditAssetsComponent>
    )
  }
}

export default AddEditAssetsPage;