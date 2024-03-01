import React, { Component } from "react";
import AddEditStoresComponent from "../components/AddEditStoresComponent.jsx";

class AddEditSroresPage extends Component {
  render() {
    return (
      <AddEditStoresComponent {...this.props}></AddEditStoresComponent>
    )
  }
}

export default AddEditSroresPage;