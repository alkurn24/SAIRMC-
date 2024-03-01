import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";

import TemplateFormComponent from "templates/components/TemplateFormComponent.jsx";

class AddEditTemplate extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {

  }
  render() {
    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <TemplateFormComponent settings={false}></TemplateFormComponent>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default AddEditTemplate;