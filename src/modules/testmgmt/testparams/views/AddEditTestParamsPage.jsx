import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import TestParamsFormComponent from "modules/testmgmt/testparams/components/TestParamsFormComponent.jsx";

class AddEditTestParams extends Component {
  componentWillMount() {

  }
  render() {
    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <TestParamsFormComponent {...this.props}></TestParamsFormComponent>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default AddEditTestParams;