import React, { Component } from "react";
import { Modal } from "react-bootstrap";

import DispatchFormComponent from "./DispatchFormComponent";

class DispatchModalComponent extends Component {
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  render() {

    return (
      <Modal
        dialogClassName="large-modal"
        show={this.props.showDispatchModal}
      // onHide={() => this.props.handleCloseDispatchModal()
      >
        <Modal.Header class="header1">
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleCloseDispatchModal()}>{null}</a>
          </div>
          <Modal.Title>Create New Dispatch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DispatchFormComponent {...this.props} modal />
        </Modal.Body>
      </Modal>
    )
  }
}

export default DispatchModalComponent;