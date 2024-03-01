import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";

class NoFeature extends Component {
  render() {
    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            This feature is not yet implemented
          </Row>
        </Grid>
      </div>
    )
  }
}

export default NoFeature;