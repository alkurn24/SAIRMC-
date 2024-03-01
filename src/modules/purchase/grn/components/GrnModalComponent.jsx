import React, { Component } from "react";
import { Modal } from "react-bootstrap";

import GrnFormComponent from "./GrnFormComponent";

class GrnModalComponent extends Component {
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  render() {
    return (
      <Modal
        dialogClassName="large-modal"
        show={this.props.showGrnModal}>
        <Modal.Header >
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleCloseGrnModal()}>{null}</a>
          </div>
          <Modal.Title>Create New GRN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GrnFormComponent {...this.props} modal />
        </Modal.Body>
      </Modal>
    )
  }
}

export default GrnModalComponent;