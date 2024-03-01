import React, { Component } from "react";
import { Modal } from "react-bootstrap";

import DispatchScheduleFormComponent from "./DispatchScheduleFormComponent";

class DispatchScheduleModalComponent extends Component {
  componentWillReceiveProps(newProps) {
    this.props = newProps
  }
  render() {
    return (
      <Modal
        dialogClassName="large-modal"
        show={this.props.showDispatchModal}
      // onHide={() => this.props.handleCloseDispatchModal()}
      >
        <Modal.Header class="header1">
          <div className="modal-close">
            <a role="button" className="fa fa-times text-danger" fill pullRight icon onClick={() => this.props.handleCloseDispatchModal()}>{null}</a>
          </div>
          <Modal.Title>Create New Dispatch Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DispatchScheduleFormComponent {...this.props} modal />
        </Modal.Body>
      </Modal>
    )
  }
}

export default DispatchScheduleModalComponent;