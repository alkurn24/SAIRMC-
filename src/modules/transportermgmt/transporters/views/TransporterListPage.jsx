import React, { Component } from "react";
import TransporterListComponent from "../components/TransporterListComponent.jsx";

class TransporterListPage extends Component {
  render() {
    return (
      <TransporterListComponent {...this.props}></TransporterListComponent>
    );
  }
}

export default TransporterListPage;