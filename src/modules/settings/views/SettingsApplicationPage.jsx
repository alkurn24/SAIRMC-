import React, { Component } from "react";
// import { Row, Col, Nav, NavItem, Tab } from "react-bootstrap";

import { getApplicationSingle } from "../server/SettingsAppServerComm.jsx";

class SettingsApplicationPage extends Component {
  constructor(props) {
    super();
    this.state = {
      settings: null
    }
  }
  componentWillMount() {
    let _this = this;
    getApplicationSingle("SKSM",
      function success(data) {
        _this.setState({ settings: data });
        console.log(data);
      },
      function error(res) {

      }
    );
  }
  render() {
    return (
      <div>
        {/* {this.state.settings.toString()} */}
      </div>
    );
  }
}

export default SettingsApplicationPage;